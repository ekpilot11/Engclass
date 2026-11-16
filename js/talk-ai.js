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
 *     onEnd({ why, seconds })   'done' | 'time' | 'mic' | 'nomic' | 'limit' | 'network' | 'other'
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
    if (navigator.onLine === false || /network|failed to fetch|load failed|could not be loaded|socket|connection|timeout|timed out/.test(msg)) return 'network';
    return 'other';
  }

  /* Load the client ahead of time. cb(ok) is optional. */
  function ready(cb) {
    loadClient().then(function () { if (cb) cb(true); }, function () { if (cb) cb(false); });
  }

  function start(o) {
    var conv = null;          // the ElevenLabs conversation, once it is connected
    var connected = false;
    var startedAt = 0;
    var ended = false;
    var lastError = '';

    function send(text) {
      if (!conv || ended) return false;
      try { conv.sendUserMessage(text); return true; } catch (e) { return false; }
    }
    function tell(name, arg) {
      if (ended || !o[name]) return;
      try { o[name](arg); } catch (e) { /* a mistake in the page must not break the call */ }
    }
    function finish(why, detail) {
      if (ended) return;
      ended = true;
      var seconds = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
      if (conv) { try { conv.endSession(); } catch (e) { /* already closed */ } }
      if (o.onEnd) { try { o.onEnd({ why: why, detail: detail || lastError || '', seconds: seconds }); } catch (e) { /* ignore */ } }
    }

    function options(connectionType) {
      var opts = {
        agentId: o.agentId,
        connectionType: connectionType,
        dynamicVariables: { level: o.level || 'normal' },
        useWakeLock: true,           // keep the screen on while they talk
        stripAudioTags: true,
        clientTools: {
          goal_done: function (p) { if (p && p.goal) tell('onGoal', String(p.goal)); return 'ok'; },
          show_feedback: function (p) { tell('onFeedback', p || {}); return 'ok'; }
        },
        onConnect: function () {
          connected = true;
          startedAt = Date.now();
          tell('onStatus', 'connected');
        },
        onDisconnect: function (d) {
          if (!connected) return;   // a first attempt that failed: start() below decides what happens
          if (d && d.reason === 'error') {
            var timeUp = d.context && d.context.type === 'max_duration_exceeded';
            finish(timeUp ? 'time' : reason(d.message), d.message);
          } else {
            finish('done');
          }
        },
        onError: function (message) { lastError = String(message || ''); },
        onMessage: function (m) {
          if (!m || !m.message) return;
          var text = String(m.message);
          if (m.role === 'agent' || m.source === 'ai') { tell('onAgent', text); return; }
          if (text.indexOf(APP) === 0) return;          // an echo of a button message
          tell('onUser', text);
        },
        onAgentResponseCorrection: function (c) {
          if (c && c.corrected_agent_response) tell('onAgentFix', String(c.corrected_agent_response));
        },
        onModeChange: function (m) { if (m && m.mode) tell('onMode', m.mode); }
      };
      if (o.speed) opts.overrides = { tts: { speed: o.speed } };
      return opts;
    }

    tell('onStatus', 'loading');
    loadClient().then(function (EL) {
      if (ended) return null;
      tell('onStatus', 'connecting');
      // WebRTC gives the best sound and echo cancelling; some networks block it, so try a plain connection next
      return EL.Conversation.startSession(options('webrtc')).catch(function (err) {
        var why = reason(err);
        if (ended || connected || why === 'mic' || why === 'nomic' || why === 'limit') throw err;
        return EL.Conversation.startSession(options('websocket'));
      });
    }).then(function (c) {
      if (!c) return;
      if (ended) { try { c.endSession(); } catch (e) { /* ignore */ } return; }   // she left while it was connecting
      conv = c;
    }).catch(function (err) {
      finish(reason(err), String((err && err.message) || err));
    });

    return {
      say: function (text) { return send(String(text)); },
      app: function (text) { return send(APP + ' ' + text); },
      mute: function (on) { if (conv && !ended) { try { conv.setMicMuted(!!on); } catch (e) { /* ignore */ } } },
      level: function () { try { return conv && !ended ? conv.getOutputVolume() || 0 : 0; } catch (e) { return 0; } },
      heard: function () { try { return conv && !ended ? conv.getInputVolume() || 0 : 0; } catch (e) { return 0; } },
      end: function () { finish('done'); },
      get open() { return !ended; }
    };
  }

  window.HDLive = { supported: supported, agent: agent, ready: ready, start: start };
})();
