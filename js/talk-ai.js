/*
 * Hello Dubai — the connection for "Live conversation": she speaks, an AI playing a person at the
 * airport answers whatever she says.
 *
 * This is a thin layer over the ElevenLabs client (js/vendor/elevenlabs-client.js), which is loaded
 * only when a conversation starts. The AI itself (voice, instructions, tools, limits) is an
 * ElevenLabs agent made by tools/make_agents.py; js/agents.js has its id. Nothing secret is in the
 * website: an agent only accepts conversations that come from the website's own address.
 *
 *   var session = HDLive.start({
 *     agentId, level, speed,
 *     onStatus(status)      'loading' | 'connecting' | 'connected'
 *     onMode(mode)          'speaking' (the AI speaks) | 'listening' (her turn)
 *     onAgent(text)         what the AI says now
 *     onAgentFix(text)      the same sentence, cut to what it really said before she interrupted
 *     onUser(text)          what the AI understood her to say
 *     onGoal(id)            the AI reports that she reached a goal
 *     onFeedback(data)      the AI's feedback at the end: { praise, corrections: [{ kind, said, better, why }], goals }
 *     onEnd({ why, detail, seconds, by })
 *                           why: 'done' | 'time' | 'mic' | 'nomic' | 'limit' | 'refused' | 'network' | 'other'
 *                           by: 'page' (the page hung up: end()) or 'far' (ElevenLabs or the connection ended it)
 *   });
 *   session.say(text)       a typed sentence, as if she had said it
 *   session.app(text)       a message from a button of the app ("[app] ..."): the AI obeys it, it is never shown
 *   session.mute(true)      close the microphone for a moment (while the app plays a sound itself)
 *   session.level()         how loud the AI is speaking right now, 0 to 1
 *   session.heard()         how loud the microphone hears her right now, 0 to 1
 *   session.end()
 *
 *   HDLive.ready(cb)        load the ElevenLabs client now; cb(true) when it is there. Do this before
 *                           the tap on "Start": on iPhone the client unlocks the sound with that tap.
 */
(function () {
  'use strict';

  var VENDOR = 'js/vendor/elevenlabs-client.js';
  var APP = '[app]';        // how a message from a button of the app begins (the AI's instructions know this)
  /* The kinds of connection, in the order they are tried. The plain WebSocket goes straight from the
     browser to ElevenLabs and carries the website's address, which the agent checks (its allowlist).
     WebRTC goes through ElevenLabs' relay, where that check can refuse the call; it is the second try. */
  var TRANSPORTS = ['websocket', 'webrtc'];
  var CONFIRM_MS = 4000;    // WebRTC: a line that is still open after this long counts as accepted
  var REFUSED = /not authori[sz]ed|access denied|forbidden|origin not allowed|\b401\b|\b403\b/;
  var loading = null;

  function supported() {
    return !!(window.isSecureContext !== false && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.WebSocket);
  }
  function agent(stopId) {
    var a = window.HD_AGENTS && window.HD_AGENTS[stopId];
    return a && a.id ? a : null;
  }

  function loadClient() {
    if (window.ElevenLabsClient) return Promise.resolve(window.ElevenLabsClient);
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = VENDOR;
      s.async = true;
      s.onload = function () {
        if (window.ElevenLabsClient) resolve(window.ElevenLabsClient);
        else { loading = null; reject(new Error('the conversation program did not load')); }
      };
      s.onerror = function () { loading = null; reject(new Error('network: the conversation program could not be loaded')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* Whatever went wrong, as one of a few reasons the page can explain. */
  function reason(err) {
    var name = (err && err.name) || '';
    var msg = String((err && err.message) || err || '').toLowerCase();
    // the browser's own names for microphone problems (an "origin not allowed" from the server is not one)
    if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError' ||
        /permission denied|microphone (access|permission)/.test(msg)) return 'mic';
    if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'NotReadableError' || name === 'AbortError' ||
        /requested device not found|no microphone|could not start audio source/.test(msg)) return 'nomic';
    if (/quota|credit|limit|exceed|concurren|too many|\b429\b|\b402\b/.test(msg)) return 'limit';
    if (REFUSED.test(msg)) return 'refused';
    if (navigator.onLine === false || /network|failed to fetch|load failed|could not be loaded|socket|connection|timeout|timed out/.test(msg)) return 'network';
    return 'other';
  }

  /* Load the client ahead of time. cb(ok) is optional. */
  function ready(cb) {
    loadClient().then(function () { if (cb) cb(true); }, function () { if (cb) cb(false); });
  }

  function start(o) {
    var conv = null;          // the ElevenLabs conversation that was accepted
    var confirmed = false;    // ElevenLabs accepted the call (not only opened the line)
    var startedAt = 0;
    var ended = false;
    var tryNo = 0;            // which connection try is the current one (callbacks of older tries are ignored)
    var tries = [];           // what went wrong with each try, for the page: "websocket: …"
    var whys = [];

    function send(text) {
      if (!conv || ended || !confirmed) return false;
      try { conv.sendUserMessage(text); return true; } catch (e) { return false; }
    }
    function tell(name, arg) {
      if (ended || !o[name]) return;
      try { o[name](arg); } catch (e) { /* a mistake in the page must not break the call */ }
    }
    function finish(why, detail, by) {
      if (ended) return;
      ended = true;
      var seconds = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
      if (conv) { try { conv.endSession(); } catch (e) { /* already closed */ } }
      if (o.onEnd) {
        try { o.onEnd({ why: why, detail: detail || '', seconds: seconds, by: by || 'far' }); } catch (e) { /* ignore */ }
      }
    }

    /* One try with one kind of connection. */
    function attempt(EL, k) {
      var n = ++tryNo;
      var type = TRANSPORTS[k];
      var mine = null;            // this try's conversation
      var lineOpen = false, lost = false, lastError = '';
      var confirmTimer = null;
      function current() { return n === tryNo && !ended; }
      function confirm() {
        if (!current() || confirmed || lost) return;
        confirmed = true;
        clearTimeout(confirmTimer);
        if (mine) conv = mine;
        startedAt = Date.now();
        tell('onStatus', 'connected');
      }
      // This try did not work: note why, then try the next kind of connection, or give up.
      function fail(err, dropped) {
        if (!current() || confirmed || lost) return;
        lost = true;
        clearTimeout(confirmTimer);
        if (mine) { try { mine.endSession(); } catch (e) { /* already closed */ } }
        var message = String((err && err.message != null ? err.message : err) || '');
        var text = message + (lastError && message.indexOf(lastError) < 0 ? (message ? ' (' : '') + lastError + (message ? ')' : '') : '');
        // a line that opens and then drops is not a sign of a bad internet connection by itself
        var why = REFUSED.test(text.toLowerCase()) ? 'refused'
          : dropped ? (navigator.onLine === false ? 'network' : 'other')
          : reason({ name: err && err.name, message: text });
        tries.push(type + ': ' + (text || 'the call ended right after it started'));
        whys.push(why);
        if (why === 'mic' || why === 'nomic' || why === 'limit' || k + 1 >= TRANSPORTS.length) {
          var overall = whys.indexOf('refused') >= 0 ? 'refused'
            : whys.indexOf('mic') >= 0 ? 'mic' : whys.indexOf('nomic') >= 0 ? 'nomic' : whys.indexOf('limit') >= 0 ? 'limit'
            : whys.indexOf('other') >= 0 ? 'other' : whys[0];
          finish(overall, tries.join(' | '), 'far');
          return;
        }
        attempt(EL, k + 1);
      }

      var opts = {
        agentId: o.agentId,
        connectionType: type,
        dynamicVariables: { level: o.level || 'normal' },
        useWakeLock: true,           // keep the screen on while they talk
        stripAudioTags: true,
        clientTools: {
          goal_done: function (p) { if (current() && p && p.goal) tell('onGoal', String(p.goal)); return 'ok'; },
          show_feedback: function (p) { if (current()) tell('onFeedback', p || {}); return 'ok'; }
        },
        onConversationCreated: function (c) { if (n === tryNo) mine = c; },
        onConnect: function () {
          if (!current()) return;
          lineOpen = true;
          tell('onStatus', 'connecting');
          // the WebSocket handshake already received ElevenLabs' answer; WebRTC waits for a sign of life
          if (type === 'websocket') confirm();
          else confirmTimer = setTimeout(function () { if (lineOpen && !lost) confirm(); }, CONFIRM_MS);
        },
        onConversationMetadata: function () { confirm(); },
        onAudio: function () { confirm(); },
        onDisconnect: function (d) {
          lineOpen = false;
          if (!current()) return;
          var message = (d && (d.message || d.closeReason || (d.context && (d.context.reason || d.context.type)))) || '';
          if (!confirmed) { fail(message, true); return; }
          if (d && d.reason === 'error') {
            var timeUp = d.context && d.context.type === 'max_duration_exceeded';
            finish(timeUp ? 'time' : reason(d.message || lastError), d.message || lastError, 'far');
          } else {
            finish('done', '', 'far');
          }
        },
        onError: function (message) { if (n === tryNo) lastError = String(message || ''); },
        onMessage: function (m) {
          if (!current() || !m || !m.message) return;
          var text = String(m.message);
          if (m.role === 'agent' || m.source === 'ai') { confirm(); tell('onAgent', text); return; }
          if (text.indexOf(APP) === 0) return;          // an echo of a button message
          tell('onUser', text);
        },
        onAgentResponseCorrection: function (c) {
          if (current() && c && c.corrected_agent_response) tell('onAgentFix', String(c.corrected_agent_response));
        },
        onModeChange: function (m) {
          if (!current() || !m || !m.mode) return;
          if (m.mode === 'speaking') confirm();
          tell('onMode', m.mode);
        }
      };
      if (o.speed) opts.overrides = { tts: { speed: o.speed } };

      var started;
      try { started = EL.Conversation.startSession(opts); } catch (e) { started = Promise.reject(e); }
      started.then(function (c) {
        mine = c;
        if (n !== tryNo || ended || lost) { try { c.endSession(); } catch (e) { /* ignore */ } return; }  // given up, or she left
        if (confirmed) conv = c;
      }, function (err) {
        fail(err, false);
      });
    }

    tell('onStatus', 'loading');
    loadClient().then(function (EL) {
      if (ended) return;
      tell('onStatus', 'connecting');
      attempt(EL, 0);
    }, function (err) {
      finish(reason(err), String((err && err.message) || err), 'far');
    });

    return {
      say: function (text) { return send(String(text)); },
      app: function (text) { return send(APP + ' ' + text); },
      mute: function (on) { if (conv && !ended) { try { conv.setMicMuted(!!on); } catch (e) { /* ignore */ } } },
      level: function () { try { return conv && !ended ? conv.getOutputVolume() || 0 : 0; } catch (e) { return 0; } },
      heard: function () { try { return conv && !ended ? conv.getInputVolume() || 0 : 0; } catch (e) { return 0; } },
      end: function () { finish('done', '', 'page'); },
      get open() { return !ended; }
    };
  }

  window.HDLive = { supported: supported, agent: agent, ready: ready, start: start };
})();
