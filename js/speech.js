/*
 * Hello Dubai — speech.
 *
 * Text-to-speech uses the voices built into the phone or computer (Web Speech API),
 * so there are no audio files to download or break. Speech recognition ("Say it")
 * is used only where the browser supports it.
 *
 * Robustness rules learned from real browsers:
 * - voices load asynchronously (voiceschanged) and can be an empty list for a while;
 * - `onend` sometimes never fires, so every utterance also has a polling + timeout fallback;
 * - utterance objects must be kept referenced or Chrome may garbage-collect them mid-speech;
 * - iOS needs the first utterance to start inside a tap, so we "unlock" on the first tap.
 */
(function () {
  'use strict';

  var synth = window.speechSynthesis || null;
  var hasTTS = !!(synth && window.SpeechSynthesisUtterance);
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;

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
  var FEMALE = /\b(female|woman|samantha|karen|moira|tessa|fiona|victoria|serena|kate|martha|stephanie|zira|hazel|susan|heera|neerja|sonia|libby|maisie|aria|jenny|michelle|emma|ava|allison|nicky|zoe|veena|isha|lekha|fatima|salma|zariyah|amina|laila|mariam|rosa|natasha|catherine|clara|emily|sara|amy|joanna|kimberly|salli|ivy|kendra|raveena|aditi|kajal|shruti|tara|lisa|olivia|mia|grace|sonia|leah|luna|nanami|yara|hala|layla|noura|rana|kiara|ananya)\b/i;
  var MALE = /\b(male|man|daniel|arthur|rishi|alex|oliver|ravi|prabhat|george|ryan|guy|tom|aaron|hamdan|maged|majed|tarik|tarek|hamed|james|thomas|william|eric|christopher|davis|tony|jason|brian|matthew|joey|justin|russell|kevin|liam|connor|mark|david|lee|nathan|aditya|hemant|madhur|naayf|omar|shakir|bassel|hassan|ahmad|ahmed|fahed|kenneth|rehaan|rahul|jamal|andrew|brandon|steffan|roger|ethan|evan)\b/i;

  var state = {
    accent: 'mixed',
    slow: false,
    voices: [],
    cast: {},          // who -> { voice, pitch }
    characters: {},
    listeners: [],
    busy: false,
    token: 0,
    live: []           // keep utterances referenced
  };

  /* ---------- voices ---------- */

  function norm(lang) { return String(lang || '').replace('_', '-').toLowerCase(); }

  function matchLang(voice, target) {
    var vl = norm(voice.lang), t = target.toLowerCase();
    if (t.length === 2) return vl === t || vl.indexOf(t + '-') === 0;
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
      state.voices.forEach(function (v) {
        if (matchLang(v, lang) && out.indexOf(v) < 0) out.push(v);
      });
    });
    out.sort(function (a, b) { return quality(b) - quality(a); });
    return out;
  }

  // Which accents a character should use, in order of preference.
  // strict: the learner explicitly chose this accent, so it wins whenever the device has it.
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
    // "you" first so it gets the best clear voice; then everybody else.
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

      // Prefer: the first accent available, the right gender, a voice nobody else uses yet,
      // and never the learner's own voice for another character.
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

  /* ---------- speaking ---------- */

  function baseRate() { return state.slow ? 0.72 : 0.95; }

  function clean(text) {
    return String(text || '')
      .replace(/[\[\]]/g, '')
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/—/g, ', ')
      .replace(/[⬆️⬅️➡️⬇️]/g, '')
      .trim();
  }

  function makeUtterance(text, who, opts) {
    opts = opts || {};
    var u = new SpeechSynthesisUtterance(clean(text));
    var c = state.cast[who] || state.cast.teacher || { voice: null, pitch: 1 };
    if (c.voice) { u.voice = c.voice; u.lang = c.voice.lang; } else { u.lang = 'en-GB'; }
    var rate = baseRate() * (opts.rate || 1);
    u.rate = Math.max(0.5, Math.min(1.6, rate));
    u.pitch = c.pitch || 1;
    u.volume = opts.volume != null ? opts.volume : 1;
    return u;
  }

  function estimate(text, rate) {
    // generous upper bound for how long a line can take, in ms
    return 2500 + (clean(text).length * 110) / (rate || 1);
  }

  function setBusy(b) {
    if (state.busy === b) return;
    state.busy = b;
    emit();
  }

  function emit() {
    state.listeners.forEach(function (fn) { try { fn(api); } catch (e) { /* ignore */ } });
  }

  function cancelAll() {
    state.token++;
    if (!hasTTS) return;
    try { if (synth.speaking || synth.pending) synth.cancel(); } catch (e) { /* ignore */ }
  }

  /*
   * Speak a list of { text, who, rate, volume } in order.
   * cb.onItem(i) when item i starts, cb.onDone({canceled}) exactly once at the end.
   */
  function sayAll(items, cb) {
    cb = cb || {};
    cancelAll();
    var token = state.token;
    var finished = false;
    var started = Date.now();
    var total = 0;

    function done(canceled) {
      if (finished) return;
      finished = true;
      clearInterval(poll);
      clearTimeout(limit);
      if (token === state.token) setBusy(false);
      state.live = state.live.filter(function (u) { return u._hdToken !== token; });
      if (cb.onDone) cb.onDone({ canceled: !!canceled || token !== state.token });
    }

    if (!hasTTS || !items.length) {
      setTimeout(function () { done(false); }, 0);
      return function () { done(true); };
    }

    setBusy(true);
    var ended = 0;
    var utterances = items.map(function (it, i) {
      var u = makeUtterance(it.text, it.who, it);
      u._hdToken = token;
      total += estimate(it.text, u.rate);
      u.onstart = function () { if (token === state.token && cb.onItem) cb.onItem(i); };
      u.onend = u.onerror = function () {
        ended++;
        if (ended >= items.length) done(false);
      };
      return u;
    });

    // Fallbacks: some engines never fire onend.
    var poll = setInterval(function () {
      if (finished) { clearInterval(poll); return; }
      if (token !== state.token) { done(true); return; }
      var elapsed = Date.now() - started;
      if (elapsed > 1500 && !synth.speaking && !synth.pending) done(false);
    }, 250);
    var limit = setTimeout(function () { done(false); }, total + 4000);

    utterances.forEach(function (u) {
      state.live.push(u);
      try { synth.speak(u); } catch (e) { done(false); }
    });
    try { if (synth.paused) synth.resume(); } catch (e) { /* ignore */ }

    return function stopThis() { if (token === state.token) cancelAll(); done(true); };
  }

  function say(text, who, opts) {
    opts = opts || {};
    return sayAll([{ text: text, who: who || 'teacher', rate: opts.rate, volume: opts.volume }], {
      onItem: opts.onstart ? function () { opts.onstart(); } : null,
      onDone: opts.onend || null
    });
  }

  function stop() {
    var wasBusy = state.busy;
    cancelAll();
    if (wasBusy) setBusy(false);
  }

  /* iOS: the very first utterance must start inside a tap. */
  var unlocked = false;
  function unlock() {
    if (unlocked || !hasTTS) return;
    unlocked = true;
    try {
      var u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      synth.speak(u);
    } catch (e) { /* ignore */ }
  }

  /* ---------- speech recognition ("Say it") ---------- */

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
    var n = target.length, m = said.length;
    var dp = [];
    for (var i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
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

  /* Compare what was heard (list of alternatives) with the target sentence. */
  function compare(alternatives, target) {
    var displayWords = clean(target).split(/\s+/);
    var tw = words(target);
    var best = { score: 0, heard: alternatives[0] || '', ok: [] };
    alternatives.forEach(function (alt) {
      var ok = lcsMatch(tw, words(alt));
      var hits = ok.filter(Boolean).length;
      var score = tw.length ? hits / tw.length : 0;
      if (score > best.score || !best.ok.length) best = { score: score, heard: alt, ok: ok };
    });
    // Map normalised-word matches back onto the display words (approximate but friendly).
    var shown = displayWords.map(function (w) {
      var parts = words(w);
      return { w: w, parts: parts.length };
    });
    var idx = 0;
    shown.forEach(function (s) {
      var good = true;
      for (var k = 0; k < s.parts; k++) { if (!best.ok[idx + k]) good = false; }
      s.ok = s.parts === 0 ? true : good;
      idx += s.parts;
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

  /* ---------- public API ---------- */

  var api = {
    hasTTS: hasTTS,
    hasRec: !!Rec,
    ACCENTS: ACCENTS,
    init: function (characters, options) {
      state.characters = characters || {};
      if (options) api.setOptions(options, true);
      if (!hasTTS) return;
      loadVoices();
      try { synth.addEventListener('voiceschanged', loadVoices); } catch (e) { synth.onvoiceschanged = loadVoices; }
      // Some browsers never fire voiceschanged: poll a few times.
      var tries = 0;
      var t = setInterval(function () { loadVoices(); if (++tries > 20 || state.voices.length) clearInterval(t); }, 250);
      var onFirstTap = function () {
        unlock();
        document.removeEventListener('pointerdown', onFirstTap, true);
        document.removeEventListener('keydown', onFirstTap, true);
      };
      document.addEventListener('pointerdown', onFirstTap, true);
      document.addEventListener('keydown', onFirstTap, true);
    },
    setOptions: function (o, silent) {
      if (o.accent && o.accent !== state.accent) { state.accent = o.accent; assign(); }
      if (typeof o.slow === 'boolean') state.slow = o.slow;
      if (!silent) emit();
    },
    get slow() { return state.slow; },
    get accent() { return state.accent; },
    get busy() { return state.busy; },
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
