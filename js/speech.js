/*
 * Hello Dubai — sound.
 *
 * 1. Recorded voices (default): every sentence was recorded in advance (tools/make_audio.py)
 *    and is played as an MP3. This works the same on every phone, also in silent mode in Safari.
 * 2. Device voices (fallback, or by choice): the phone's own speech engine (Web Speech API),
 *    with a choice of accents.
 * 3. "Say it": speech recognition, only where the browser supports it.
 *
 * Robustness rules learned from real browsers:
 * - iPhones only allow sound that starts from a tap, so the first tap "unlocks" the audio player;
 * - a speech engine can stay silent without any error, so every item has a watchdog timer;
 * - a sentence without a recording, or a recording that can't play, falls back to the device voice.
 */
(function () {
  'use strict';

  var Items = window.HDSpeechItems;
  var synth = window.speechSynthesis || null;
  var hasTTS = !!(synth && window.SpeechSynthesisUtterance);
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var SILENT = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAABQAAAqAAbW1tbW1tbW1tbW1tbW1tbW1tbZKSkpKSkpKSkpKSkpKSkpKSkpKStra2tra2tra2tra2tra2tra2trbb29vb29vb29vb29vb29vb29vb2///////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQDYAAAAAAAAAKgvT9wHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

  var ACCENTS = {
    gb: { label: 'British', langs: ['en-GB', 'en-IE'] },
    us: { label: 'American', langs: ['en-US', 'en-CA'] },
    in: { label: 'Indian', langs: ['en-IN'] },
    ph: { label: 'Filipino', langs: ['en-PH'] },
    au: { label: 'Australian', langs: ['en-AU', 'en-NZ'] },
    ar: { label: 'Arabic', langs: ['ar-AE', 'ar-SA', 'ar'] }
  };

  var NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox|kathy|grandma|grandpa|rocko)\b/i;
  var ROBOTIC = /\b(fred|eddy|flo|reed|sandy|shelley|espeak)\b/i;
  var FEMALE = /\b(female|woman|samantha|karen|moira|tessa|fiona|victoria|serena|kate|martha|stephanie|zira|hazel|susan|heera|neerja|sonia|libby|maisie|aria|jenny|michelle|emma|ava|allison|nicky|zoe|veena|isha|lekha|fatima|salma|zariyah|amina|laila|mariam|rosa|natasha|catherine|clara|emily|sara|amy|joanna|kimberly|salli|ivy|kendra|raveena|aditi|kajal|shruti|tara|lisa|olivia|mia|grace|leah|luna|nanami|yara|hala|layla|noura|rana|kiara|ananya)\b/i;
  var MALE = /\b(male|man|daniel|arthur|rishi|alex|oliver|ravi|prabhat|george|ryan|guy|tom|aaron|hamdan|maged|majed|tarik|tarek|hamed|james|thomas|william|eric|christopher|davis|tony|jason|brian|matthew|joey|justin|russell|kevin|liam|connor|mark|david|lee|nathan|aditya|hemant|madhur|naayf|omar|shakir|bassel|hassan|ahmad|ahmed|fahed|kenneth|rehaan|rahul|jamal|andrew|brandon|steffan|roger|ethan|evan)\b/i;

  var state = {
    source: 'recorded',  // 'recorded' | 'device'
    accent: 'mixed',
    slow: false,
    voices: [],
    cast: {},
    characters: {},
    listeners: [],
    busy: false,
    token: 0,
    runner: null,
    live: [],
    media: 'data',       // how recordings are played: 'data' URL, 'blob' URL, or 'broken'
    blocked: false,      // the browser refused to start sound (needs a tap)
    lastError: ''
  };

  /* ================================================================ recorded voices */

  var AUDIO = window.HD_AUDIO || null;
  var clips = {};
  var packs = {};        // name -> 'loading' | 'loaded' | 'failed'
  var waiters = {};      // name -> [callbacks]
  var blobUrls = {};

  window.HDAudioPack = function (name, data) {
    Object.keys(data).forEach(function (k) { clips[k] = data[k]; });
    packs[name] = 'loaded';
    (waiters[name] || []).forEach(function (cb) { try { cb(true); } catch (e) { /* ignore */ } });
    waiters[name] = [];
    emit();
  };

  function loadPack(name, cb) {
    cb = cb || function () {};
    if (!AUDIO || !AUDIO.packs[name]) { cb(false); return; }
    if (packs[name] === 'loaded') { cb(true); return; }
    if (packs[name] === 'failed') { cb(false); return; }
    (waiters[name] = waiters[name] || []).push(cb);
    if (packs[name] === 'loading') return;
    packs[name] = 'loading';
    var s = document.createElement('script');
    s.src = AUDIO.packs[name];
    s.async = true;
    s.onerror = function () {
      packs[name] = 'failed';
      (waiters[name] || []).forEach(function (fn) { try { fn(false); } catch (e) { /* ignore */ } });
      waiters[name] = [];
      emit();
    };
    document.head.appendChild(s);
  }

  var player = null;
  function getPlayer() {
    if (!player) {
      player = new Audio();
      player.preload = 'auto';
      try { player.preservesPitch = true; player.webkitPreservesPitch = true; } catch (e) { /* ignore */ }
    }
    return player;
  }

  function srcFor(k) {
    if (state.media === 'blob') {
      if (!blobUrls[k]) {
        var bin = atob(clips[k]);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        blobUrls[k] = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
      }
      return blobUrls[k];
    }
    return 'data:audio/mpeg;base64,' + clips[k];
  }

  function recordedOn() { return state.source === 'recorded' && !!AUDIO && state.media !== 'broken'; }
  function keyFor(it) { return Items.key(it.who, it.text, it.fx); }
  function hasRecording(it) { return !!(AUDIO && AUDIO.keys[keyFor(it)]); }

  var stopClip = null;   // cleans up the clip that is playing now

  function playClip(k, it, onstart, done) {
    var p = getPlayer();
    var finished = false, started = false, watch = null;
    function cleanup() {
      p.removeEventListener('playing', onPlaying);
      p.removeEventListener('ended', onEnded);
      p.removeEventListener('error', onError);
      p.removeEventListener('loadedmetadata', onMeta);
      clearTimeout(watch);
      if (stopClip === cleanup) stopClip = null;
    }
    function finish(result) {
      if (finished) return;
      finished = true;
      cleanup();
      done(result);
    }
    function onPlaying() { unlocked = true; if (!started) { started = true; state.blocked = false; if (onstart) onstart(); } }
    function onEnded() { finish('ok'); }
    function onMeta() {
      var d = p.duration;
      clearTimeout(watch);
      if (isFinite(d) && d > 0) watch = setTimeout(function () { finish('ok'); }, (d / (p.playbackRate || 1)) * 1000 + 2500);
    }
    function onError() {
      if (finished) return;
      state.lastError = 'media-' + state.media;
      // data: URLs may be blocked by a strict page policy; try a blob: URL once, then give up on recordings.
      state.media = state.media === 'data' ? 'blob' : 'broken';
      emit();
      finish(state.media === 'broken' ? 'fallback' : 'retry');
    }
    if (stopClip) stopClip();
    stopClip = cleanup;
    p.addEventListener('playing', onPlaying);
    p.addEventListener('ended', onEnded);
    p.addEventListener('error', onError);
    p.addEventListener('loadedmetadata', onMeta);
    var rate = (state.slow || it.slow) ? 0.8 : 1;
    try {
      p.src = srcFor(k);
      p.defaultPlaybackRate = rate;
      p.playbackRate = rate;
    } catch (e) { onError(); return; }
    watch = setTimeout(function () { finish(started ? 'ok' : 'fallback'); }, 30000);
    var pr;
    try { pr = p.play(); } catch (e) { pr = null; finish('fallback'); }
    if (pr && pr.catch) {
      pr.catch(function (err) {
        if (finished) return;
        if (err && err.name === 'NotAllowedError') {
          state.blocked = true;
          state.lastError = 'not-allowed';
          emit();
          finish('fallback');
        } else if (err && err.name === 'AbortError') {
          /* replaced by another sentence: nothing to do */
        } else {
          onError();
        }
      });
    }
  }

  /* ================================================================ device voices */

  function norm(lang) { return String(lang || '').replace('_', '-').toLowerCase(); }
  function matchLang(voice, target) {
    var vl = norm(voice.lang), t = target.toLowerCase();
    return vl === t || vl.indexOf(t + '-') === 0;
  }
  function quality(v) {
    var n = v.name || '';
    var s = 0;
    if (NOVELTY.test(n)) s -= 100;
    if (ROBOTIC.test(n)) s -= 8;
    if (/natural|neural|premium|enhanced|wavenet|studio/i.test(n)) s += 6;
    if (/google/i.test(n)) s += 3;
    if (/siri/i.test(n)) s += 4;
    if (/microsoft/i.test(n) && !/natural|online/i.test(n)) s += 1;
    if (v.localService) s += 0.5;
    return s;
  }
  function gender(v) {
    var n = (v.name || '').replace(/[-_()]/g, ' ');
    if (FEMALE.test(n)) return 'f';
    if (MALE.test(n)) return 'm';
    return null;
  }
  function loadVoices() {
    if (!hasTTS) return;
    var list = [];
    try { list = synth.getVoices() || []; } catch (e) { list = []; }
    list = list.filter(function (v) { return v && v.lang && quality(v) > -50; });
    if (list.length === state.voices.length && list.length > 0) return;
    state.voices = list;
    assign();
    emit();
  }
  function voicesForAccent(key) {
    var acc = ACCENTS[key];
    if (!acc) return [];
    var out = [];
    acc.langs.forEach(function (lang) {
      state.voices.forEach(function (v) { if (matchLang(v, lang) && out.indexOf(v) < 0) out.push(v); });
    });
    out.sort(function (a, b) { return quality(b) - quality(a); });
    return out;
  }
  // Which accents a character should use. strict: the learner chose this accent, so it wins.
  function accentsFor(c) {
    var fallback = ['gb', 'us', 'au', 'in'];
    if (!c || c.group === 'you' || c.group === 'kid') return { list: ['gb', 'us', 'au'], strict: false };
    var mode = state.accent;
    var mixed = (c.mixed || []).concat(fallback);
    if (mode === 'gb' || mode === 'us') return { list: [mode].concat(fallback), strict: true };
    if ((mode === 'in' || mode === 'ar') && c.group === 'staff') return { list: [mode].concat(mixed), strict: true };
    return { list: mixed, strict: false };
  }
  var REUSE_PITCH = [1, 0.88, 1.12, 0.8, 1.2];
  function assign() {
    var used = {};
    var cast = {};
    var english = state.voices.filter(function (v) { return matchLang(v, 'en'); })
      .sort(function (a, b) { return quality(b) - quality(a); });
    var keys = Object.keys(state.characters);
    keys.sort(function (a, b) { return (a === 'you' ? -1 : 0) - (b === 'you' ? -1 : 0); });
    keys.forEach(function (who) {
      var c = state.characters[who];
      var pref = accentsFor(c);
      var candidates = [];
      pref.list.forEach(function (key) {
        voicesForAccent(key).forEach(function (v) { if (candidates.indexOf(v) < 0) candidates.push(v); });
      });
      if (!candidates.length) candidates = english.length ? english : state.voices.slice();
      if (!candidates.length) { cast[who] = { voice: null, pitch: 1 }; return; }
      var firstLang = norm(candidates[0].lang);
      var youVoice = cast.you && cast.you.voice;
      var best = null, bestScore = -Infinity;
      candidates.forEach(function (v, i) {
        var g = gender(v);
        var score = quality(v) - i * 0.01;
        if (norm(v.lang) === firstLang) score += pref.strict ? 20 : 4;
        if (c.gender && g === c.gender) score += 3;
        if (c.gender && g && g !== c.gender) score -= 3;
        score -= (used[v.voiceURI || v.name] || 0) * 2.5;
        if (who === 'teacher') { if (youVoice === v) score += 3; }
        else if (who !== 'you' && youVoice === v) score -= 6;
        if (score > bestScore) { bestScore = score; best = v; }
      });
      var key = best.voiceURI || best.name;
      var reuse = used[key] || 0;
      if (who !== 'teacher') used[key] = reuse + 1;
      var g = gender(best);
      var pitch = 1;
      if (c.gender && g && g !== c.gender) pitch = c.gender === 'm' ? 0.78 : 1.22;
      if (!g && c.gender === 'm') pitch = 0.92;
      if (who !== 'you' && who !== 'teacher') pitch *= REUSE_PITCH[Math.min(reuse, REUSE_PITCH.length - 1)];
      cast[who] = { voice: best, pitch: Math.max(0.6, Math.min(1.5, pitch)) };
    });
    state.cast = cast;
  }

  var stopTts = null;
  function ttsOne(it, onstart, done) {
    if (!hasTTS) { setTimeout(function () { done('ok'); }, 0); return; }
    var u = new SpeechSynthesisUtterance(Items.clean(it.text));
    var c = state.cast[it.who] || state.cast.teacher || { voice: null, pitch: 1 };
    if (c.voice) { u.voice = c.voice; u.lang = c.voice.lang; } else { u.lang = 'en-GB'; }
    var rate = (state.slow || it.slow ? 0.72 : 0.95) * (it.fx === 'fast' ? 1.4 : 1);
    u.rate = Math.max(0.5, Math.min(1.6, rate));
    u.pitch = c.pitch || 1;
    u.volume = it.fx === 'quiet' ? 0.22 : 1;
    var finished = false;
    var startedAt = Date.now();
    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(poll);
      clearTimeout(limit);
      if (stopTts === cancel) stopTts = null;
      done('ok');
    }
    function cancel() { finished = true; clearInterval(poll); clearTimeout(limit); }
    u.onstart = function () { if (onstart) onstart(); };
    u.onend = finish;
    u.onerror = function (e) { if (e && e.error) state.lastError = 'tts-' + e.error; finish(); };
    state.live = [u];  // keep a reference, or Chrome may drop the events
    if (stopTts) stopTts();
    stopTts = cancel;
    var poll = setInterval(function () {
      if (Date.now() - startedAt > 1500 && !synth.speaking && !synth.pending) finish();
    }, 250);
    var limit = setTimeout(finish, 2500 + (u.text.length * 110) / u.rate);
    try {
      if (synth.speaking || synth.pending) synth.cancel();
      synth.speak(u);
      if (synth.paused) synth.resume();
    } catch (e) { finish(); }
  }

  /* ================================================================ playing sentences */

  function playOne(it, token, onstart, done) {
    if (!recordedOn() || !hasRecording(it)) { ttsOne(it, onstart, done); return; }
    var k = keyFor(it);
    if (clips[k]) {
      playClip(k, it, onstart, function (result) {
        if (token !== state.token) return;
        if (result === 'retry') playOne(it, token, onstart, done);
        else if (result === 'fallback') ttsOne(it, onstart, done);
        else done('ok');
      });
      return;
    }
    // The pack with this sentence isn't loaded yet: load it, or use the device voice after 4 seconds.
    var waited = false;
    var t = setTimeout(function () { if (waited) return; waited = true; if (token === state.token) ttsOne(it, onstart, done); }, 4000);
    loadPack(AUDIO.keys[k][0], function (ok) {
      if (waited) return;
      waited = true;
      clearTimeout(t);
      if (token !== state.token) return;
      if (ok && clips[k]) playOne(it, token, onstart, done);
      else ttsOne(it, onstart, done);
    });
  }

  function halt() {
    if (stopClip) stopClip();
    if (player) { try { player.pause(); } catch (e) { /* ignore */ } }
    if (stopTts) stopTts();
    if (hasTTS) { try { if (synth.speaking || synth.pending) synth.cancel(); } catch (e) { /* ignore */ } }
  }

  function setBusy(b) { if (state.busy !== b) { state.busy = b; emit(); } }
  function emit() { state.listeners.forEach(function (fn) { try { fn(api); } catch (e) { /* ignore */ } }); }

  /*
   * Say a list of { text, who, fx, slow } one after the other.
   * cb.onItem(i) when item i starts; cb.onDone({ canceled }) exactly once at the end.
   */
  function sayAll(items, cb) {
    cb = cb || {};
    stop();
    var token = ++state.token;
    var i = 0, ended = false;
    var runner = {
      cancel: function () {
        if (ended) return;
        ended = true;
        if (cb.onDone) cb.onDone({ canceled: true });
      }
    };
    state.runner = runner;
    setBusy(true);
    function next() {
      if (ended || token !== state.token) return;
      if (i >= items.length) {
        ended = true;
        state.runner = null;
        setBusy(false);
        if (cb.onDone) cb.onDone({ canceled: false });
        return;
      }
      var idx = i++;
      playOne(items[idx], token,
        function () { if (token === state.token && cb.onItem) cb.onItem(idx); },
        function () { if (token === state.token) next(); });
    }
    next();
    return function () { if (token === state.token) stop(); };
  }

  function say(text, who, opts) {
    opts = opts || {};
    return sayAll([{ text: text, who: who || 'teacher', fx: opts.fx || '', slow: !!opts.slow }], {
      onItem: opts.onstart ? function () { opts.onstart(); } : null,
      onDone: opts.onend || null
    });
  }

  function stop() {
    var r = state.runner;
    state.runner = null;
    state.token++;
    halt();
    if (r) r.cancel();
    setBusy(false);
  }

  /* The first tap unlocks sound on iPhone: play a tiny silent clip (and wake the speech engine).
     iPhones only count "click" / "touchend" as a tap for sound, and we retry until it works. */
  var unlocked = false, unlocking = false;
  function unlock() {
    if (unlocked || unlocking) return;
    var p = getPlayer();
    if (state.busy || (p.src && !p.paused)) return;  // something is already playing: that unlocks it
    unlocking = true;
    try {
      p.src = SILENT;
      var pr = p.play();
      if (pr && pr.then) pr.then(function () { unlocked = true; unlocking = false; }, function () { unlocking = false; });
      else { unlocked = true; unlocking = false; }
    } catch (e) { unlocking = false; }
    if (hasTTS && state.source === 'device') {
      try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) { /* ignore */ }
    }
  }

  /* ================================================================ "Say it" (speech recognition) */

  var SMALL = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWords(n) {
    if (n < 20) return SMALL[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + SMALL[n % 10] : '');
    if (n < 1000) return SMALL[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
    if (n < 1000000) return numWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numWords(n % 1000) : '');
    return String(n);
  }
  function words(s) {
    s = String(s || '').toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/wi-?fi/g, 'wifi')
      .replace(/(\d),(\d{3})/g, '$1$2')
      .replace(/\d+/g, function (d) { return d.length > 6 ? d : ' ' + numWords(parseInt(d, 10)) + ' '; })
      .replace(/\bcan't\b|\bcannot\b/g, 'can not')
      .replace(/\bwon't\b/g, 'will not')
      .replace(/n't\b/g, ' not')
      .replace(/'re\b/g, ' are')
      .replace(/'m\b/g, ' am')
      .replace(/'ll\b/g, ' will')
      .replace(/'ve\b/g, ' have')
      .replace(/'d\b/g, ' would')
      .replace(/'s\b/g, ' is')
      .replace(/\bokay\b/g, 'ok')
      .replace(/-/g, ' ')
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return s ? s.split(' ') : [];
  }
  function lcsMatch(target, said) {
    var n = target.length, m = said.length, dp = [], i, j;
    for (i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        dp[i][j] = target[i] === said[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ok = new Array(n).fill(false);
    i = 0; j = 0;
    while (i < n && j < m) {
      if (target[i] === said[j]) { ok[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return ok;
  }
  function compare(alternatives, target) {
    var displayWords = Items.clean(target).split(/\s+/);
    var tw = words(target);
    var best = { score: 0, heard: alternatives[0] || '', ok: [] };
    alternatives.forEach(function (alt) {
      var ok = lcsMatch(tw, words(alt));
      var hits = ok.filter(Boolean).length;
      var score = tw.length ? hits / tw.length : 0;
      if (score > best.score || !best.ok.length) best = { score: score, heard: alt, ok: ok };
    });
    var idx = 0;
    var shown = displayWords.map(function (w) {
      var parts = words(w).length;
      var good = true;
      for (var k = 0; k < parts; k++) { if (!best.ok[idx + k]) good = false; }
      idx += parts;
      return { w: w, ok: parts === 0 ? true : good };
    });
    return { score: best.score, heard: best.heard, words: shown };
  }
  var currentRec = null;
  function listen(handlers) {
    handlers = handlers || {};
    if (!Rec) { if (handlers.error) handlers.error('unsupported'); return function () {}; }
    stop();
    if (currentRec) { try { currentRec.abort(); } catch (e) { /* ignore */ } }
    var r;
    try { r = new Rec(); } catch (e) { if (handlers.error) handlers.error('unsupported'); return function () {}; }
    currentRec = r;
    r.lang = 'en-US';
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 5;
    var got = false, failed = false;
    r.onresult = function (e) {
      got = true;
      var alts = [];
      var res = e.results && e.results[0];
      if (res) for (var i = 0; i < res.length; i++) alts.push(res[i].transcript);
      if (handlers.result) handlers.result(alts);
    };
    r.onerror = function (e) { failed = true; if (handlers.error) handlers.error(e.error || 'error'); };
    r.onend = function () {
      if (currentRec === r) currentRec = null;
      if (!got && !failed && handlers.error) handlers.error('no-speech');
      if (handlers.end) handlers.end();
    };
    try { r.start(); } catch (e) { failed = true; if (handlers.error) handlers.error('start-failed'); }
    return function () { try { r.stop(); } catch (e) { /* ignore */ } };
  }

  /* ================================================================ public API */

  var api = {
    hasTTS: hasTTS,
    hasRec: !!Rec,
    hasRecorded: !!AUDIO,
    ACCENTS: ACCENTS,
    init: function (characters, options) {
      state.characters = characters || {};
      if (options) api.setOptions(options, true);
      var onTap = function () {
        if (unlocked) {
          document.removeEventListener('click', onTap, true);
          document.removeEventListener('touchend', onTap, true);
          document.removeEventListener('keydown', onTap, true);
          return;
        }
        unlock();
      };
      document.addEventListener('click', onTap, true);
      document.addEventListener('touchend', onTap, true);
      document.addEventListener('keydown', onTap, true);
      if (!hasTTS) return;
      loadVoices();
      try { synth.addEventListener('voiceschanged', loadVoices); } catch (e) { synth.onvoiceschanged = loadVoices; }
      var tries = 0;
      var t = setInterval(function () { loadVoices(); if (++tries > 20 || state.voices.length) clearInterval(t); }, 250);
    },
    setOptions: function (o, silent) {
      if (o.accent && o.accent !== state.accent) { state.accent = o.accent; assign(); }
      if (typeof o.slow === 'boolean') state.slow = o.slow;
      if (o.source === 'recorded' || o.source === 'device') state.source = o.source;
      if (!silent) emit();
    },
    get slow() { return state.slow; },
    get accent() { return state.accent; },
    get source() { return state.source; },
    get busy() { return state.busy; },
    status: function () {
      return {
        recorded: recordedOn(),
        media: state.media,
        blocked: state.blocked,
        lastError: state.lastError,
        voices: state.voices.length
      };
    },
    preload: function (names) { (names || []).forEach(function (n) { loadPack(n); }); },
    loadPack: loadPack,
    packNames: function () { return AUDIO ? Object.keys(AUDIO.packs) : []; },
    packState: function (name) { return packs[name] || 'none'; },
    recordedLabel: function (who) { return AUDIO && AUDIO.voices ? AUDIO.voices[who] || '' : ''; },
    voiceCount: function () { return state.voices.length; },
    voiceFor: function (who) { return state.cast[who] || null; },
    available: function (key) { return voicesForAccent(key).length > 0; },
    say: say,
    sayAll: sayAll,
    stop: stop,
    listen: listen,
    compare: compare,
    onChange: function (fn) { state.listeners.push(fn); },
    offChange: function (fn) { state.listeners = state.listeners.filter(function (x) { return x !== fn; }); }
  };

  window.HDSpeech = api;
})();
