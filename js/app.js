/*
 * Hello Dubai — the app: routing, pages and the interactive activities.
 * No frameworks and no build step. Pages are addressed with simple hashes:
 *   #                home (the flight boards)
 *   #passport        a stop
 *   #passport-gaps   an activity of a stop
 *   #phrasebook, #options
 */
(function () {
  'use strict';

  var C = window.HD_CONTENT;
  var SP = window.HDSpeech;
  var Items = window.HDSpeechItems;
  var app = document.getElementById('app');

  /* ================================================================ helpers */

  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, String(v));
      });
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    if (typeof c === 'string' || typeof c === 'number') { el.appendChild(document.createTextNode(String(c))); return; }
    el.appendChild(c);
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  var ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    forward: '<path d="M9 18l6-6-6-6"/>',
    arrow: '<path d="M4 12h15"/><path d="M13 5l7 7-7 7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
    volume: '<path d="M11 5L6 9H2v6h4l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><path d="M12 19v3"/>',
    eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9"/><path d="M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2"/><path d="M1 1l22 22"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    expand: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    retry: '<path d="M1 4v6h6"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>'
  };
  function icon(name, cls) {
    var s = h('span', { class: 'ico' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true' });
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" focusable="false">' + ICONS[name] + '</svg>';
    return s;
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function strip(t) { return String(t).replace(/[\[\]]/g, ''); }
  function same(a, b) { return String(a).trim().toLowerCase() === String(b).trim().toLowerCase(); }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function later(fn, ms) { var t = setTimeout(fn, ms); cleanup.push(function () { clearTimeout(t); }); }
  function scrollSoft(el, block) {
    requestAnimationFrame(function () {
      try { el.scrollIntoView({ block: block || 'nearest', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(false); }
    });
  }
  function isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  /* ================================================================ storage */

  var KEY = 'hello-dubai-v1';
  var store = { settings: { accent: 'mixed', slow: false, text: true, pt: true, source: 'recorded' }, progress: {}, stamps: {} };
  (function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return;
      if (d.settings) Object.keys(d.settings).forEach(function (k) { store.settings[k] = d.settings[k]; });
      if (d.progress && typeof d.progress === 'object') store.progress = d.progress;
      if (d.stamps && typeof d.stamps === 'object') store.stamps = d.stamps;
    } catch (e) { /* private mode or blocked storage: start fresh */ }
  })();
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  /* Portuguese help, shown when the setting is on. */
  function ptOn() { return store.settings.pt !== false; }
  function pt(text, tag, cls) {
    if (!text || !ptOn()) return null;
    return h(tag || 'p', { class: 'pt' + (cls ? ' ' + cls : ''), lang: 'pt-BR' }, text);
  }
  function tr(item) { return typeof item === 'string' ? { t: item, pt: '' } : item; }

  /* ================================================================ content index */

  var journeys = C.journeys;
  var stops = [];
  journeys.forEach(function (j) { j.stops.forEach(function (s) { s.journey = j; stops.push(s); }); });
  function stopById(id) {
    for (var i = 0; i < stops.length; i++) if (stops[i].id === id) return stops[i];
    return null;
  }

  var ACT = {
    words:     { title: 'New words',        pt: 'Palavras novas',     desc: 'Look, listen and learn' },
    signs:     { title: 'Learn the signs',  pt: 'Aprenda as placas',  desc: 'Tap a sign to hear it' },
    listen:    { title: 'Listen',           pt: 'Ouça',               desc: 'Hear the conversation' },
    gaps:      { title: 'Fill the gaps',    pt: 'Complete',           desc: 'Listen and complete' },
    signquiz:  { title: 'Which sign?',      pt: 'Qual placa?',        desc: 'Choose the right sign' },
    signorder: { title: 'Follow the signs', pt: 'Siga as placas',     desc: 'Put them in order' },
    talk:      { title: 'Your turn',        pt: 'Sua vez',            desc: 'Choose what to say' }
  };
  function activitiesOf(stop) {
    var list = [];
    if (stop.vocab) list.push('words');
    if (stop.signs) list.push('signs');
    if (stop.dialogue) { list.push('listen'); list.push('gaps'); }
    if (stop.signquiz) list.push('signquiz');
    if (stop.signorder) list.push('signorder');
    if (stop.roleplay) list.push('talk');
    return list;
  }
  function pkey(stop, act) { return stop.id + '-' + act; }
  function stopProgress(stop) {
    var acts = activitiesOf(stop);
    var done = acts.filter(function (a) { return !!store.progress[pkey(stop, a)]; }).length;
    return { done: done, total: acts.length };
  }

  /* ================================================================ routing */

  var cleanup = [];

  function parseHash() {
    var raw = '';
    try { raw = decodeURIComponent((location.hash || '').replace(/^#/, '')); } catch (e) { raw = ''; }
    if (!raw || raw === 'home') return { view: 'home' };
    if (raw === 'phrasebook') return { view: 'phrases' };
    if (raw === 'options' || raw === 'audio') return { view: 'options' };
    var dash = raw.indexOf('-');
    var stop = stopById(dash > 0 ? raw.slice(0, dash) : raw);
    if (!stop) return { view: 'home' };
    var act = dash > 0 ? raw.slice(dash + 1) : null;
    if (act && activitiesOf(stop).indexOf(act) >= 0) return { view: 'activity', stop: stop, act: act };
    return { view: 'stop', stop: stop };
  }

  function render() {
    cleanup.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
    cleanup = [];
    SP.stop();
    closeOverlay();
    var r = parseHash();
    if (r.stop) SP.preload([r.stop.id]);
    if (r.view === 'phrases' || r.view === 'options') SP.preload(['common']);
    var view;
    if (r.view === 'stop') view = viewStop(r.stop);
    else if (r.view === 'activity') view = viewActivity(r.stop, r.act);
    else if (r.view === 'phrases') view = viewPhrases();
    else if (r.view === 'options') view = viewOptions();
    else view = viewHome();
    clear(app);
    app.appendChild(view);
    window.scrollTo(0, 0);
    var title = r.view === 'activity' ? ACT[r.act].title + ' · ' + r.stop.title
      : r.view === 'stop' ? r.stop.title
      : r.view === 'phrases' ? 'Phrasebook'
      : r.view === 'options' ? 'Settings' : '';
    document.title = title ? title + ' · Hello Dubai' : 'Hello Dubai';
    var h1 = app.querySelector('h1');
    if (h1 && r.view !== 'home') {
      h1.setAttribute('tabindex', '-1');
      try { h1.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
  }
  window.addEventListener('hashchange', render);

  /* ================================================================ shared UI */

  function topbar(opts) {
    opts = opts || {};
    var left = opts.back
      ? h('a', { class: 'tb-back', href: opts.back.href }, icon('back'), h('span', { class: 'tb-back-label' }, opts.back.label))
      : h('a', { class: 'brand', href: '#', 'aria-label': 'Hello Dubai, home' },
          h('span', { class: 'brand-mark', 'aria-hidden': 'true' }, 'Hi'),
          h('span', { class: 'brand-name' }, 'Hello Dubai'));
    var right = h('div', { class: 'tb-right' },
      speedToggle(),
      opts.back ? null : h('a', { class: 'tb-btn', href: '#phrasebook', 'aria-label': 'Phrasebook', title: 'Phrasebook' }, icon('book')),
      opts.back ? null : h('a', { class: 'tb-btn', href: '#options', 'aria-label': 'Settings', title: 'Settings' }, icon('sliders')));
    return h('header', { class: 'topbar' }, h('div', { class: 'topbar-in' }, left, right));
  }

  function speedToggle() {
    var b = h('button', { class: 'speed', type: 'button' });
    function paint() {
      clear(b);
      add(b, [h('span', { class: 'speed-ico', 'aria-hidden': 'true' }, '🐢'), h('span', null, 'Slow'), store.settings.slow ? icon('check') : null]);
      b.setAttribute('aria-pressed', store.settings.slow ? 'true' : 'false');
      b.setAttribute('title', store.settings.slow ? 'Slow speech is on (fala lenta ligada)' : 'Slow speech is off (fala lenta desligada)');
    }
    b.addEventListener('click', function () { setSlow(!store.settings.slow); });
    document.addEventListener('hd:slow', paint);
    cleanup.push(function () { document.removeEventListener('hd:slow', paint); });
    paint();
    return b;
  }
  function setSlow(v) {
    store.settings.slow = !!v;
    save();
    SP.setOptions({ slow: store.settings.slow });
    var ev;
    try { ev = new CustomEvent('hd:slow'); } catch (e) { ev = document.createEvent('Event'); ev.initEvent('hd:slow', false, false); }
    document.dispatchEvent(ev);
  }

  /* A notice that appears only when sound has a problem. */
  function audioNotice() {
    var el = h('div', { class: 'notice', role: 'status', hidden: true });
    function paint() {
      var st = SP.status();
      var msg = null, msgPt = null;
      if (!st.recorded && !SP.hasTTS) {
        msg = 'This browser can’t play sound. You can still read everything.';
        msgPt = 'Este navegador não consegue tocar som. Você ainda pode ler tudo.';
      } else if (st.blocked) {
        msg = 'Tap a ▶ button to start the sound.' + (isIOS() ? ' No sound? Turn off silent mode (the switch on the side of the iPhone).' : '');
        msgPt = 'Toque num botão ▶ para começar o som.' + (isIOS() ? ' Sem som? Desligue o modo silencioso (a chave na lateral do iPhone).' : '');
      }
      clear(el);
      if (!msg) { el.hidden = true; return; }
      add(el, [h('p', null, h('strong', null, 'Sound: '), msg, ' ', h('a', { href: '#options' }, 'Sound settings')), pt(msgPt)]);
      el.hidden = false;
    }
    SP.onChange(paint);
    cleanup.push(function () { SP.offChange(paint); });
    paint();
    return el;
  }

  function instr(en, ptText) {
    return h('div', { class: 'instr' }, h('p', null, en), pt(ptText));
  }

  /* Lesson pictures (img/index.js). Missing or broken pictures show the fallback (an emoji) instead. */
  var IMG = window.HD_IMAGES || {};
  var Keys = window.HDImageKeys;
  function hasPic(key) { return !!IMG[key]; }
  function pic(key, alt, fallback, cls) {
    var src = IMG[key];
    if (!src) return fallback;
    var size = Keys.SIZES[Keys.kind(key)] || [400, 400];
    var img = h('img', { src: src, alt: alt || '', class: cls || null, loading: 'lazy', decoding: 'async', width: size[0], height: size[1] });
    img.addEventListener('error', function () {
      if (!img.parentNode) return;
      var fb = typeof fallback === 'string' ? document.createTextNode(fallback) : fallback;
      if (fb) img.parentNode.replaceChild(fb, img); else img.parentNode.removeChild(img);
    });
    return img;
  }

  function avatarOf(who) {
    var ch = C.characters[who] || { name: who, avatar: '🙂' };
    var key = Keys.person(who);
    return h('span', { class: 'avatar' + (hasPic(key) ? ' has-img' : ''), 'aria-hidden': 'true' }, pic(key, '', ch.avatar));
  }
  function sceneThumb(stop, cls) {
    var key = Keys.scene(stop);
    return hasPic(key) ? pic(key, '', stop.icon, cls) : stop.icon;
  }

  /* Chat bubble used by "Listen" and "Your turn". */
  function makeBubble(line, opts) {
    opts = opts || {};
    var ch = C.characters[line.who] || { name: line.who };
    var isYou = line.who === 'you';
    var text = strip(line.t);
    var spoken = line.say || line.t;
    var fx = opts.fx || '';
    var el = h('div', { class: 'bubble pop-in' + (isYou ? ' you' : '') });
    var textEl = h('span', { class: 'b-text' }, text);
    var ptEl = line.pt && ptOn() ? h('span', { class: 'b-pt', lang: 'pt-BR', hidden: true }, line.pt) : null;
    var main = h('button', { class: 'b-main', type: 'button', 'aria-label': ch.name + ': ' + text + '. Play.' },
      h('span', { class: 'b-name' }, ch.name, ' ', icon('volume', 'b-vol')),
      textEl, ptEl);
    var tools = h('div', { class: 'b-tools' });
    var result = h('div', { class: 'say-host', 'aria-live': 'polite' });
    el.appendChild(avatarOf(line.who));
    el.appendChild(h('div', { class: 'b-col' }, main, tools, result));

    var revealBtn = h('button', { class: 'chip-btn', type: 'button', hidden: true }, icon('eye'), h('span', null, 'Show words'));
    revealBtn.addEventListener('click', function () { setHidden(false); });
    tools.appendChild(revealBtn);

    var ptBtn = null;
    if (ptEl) {
      ptBtn = h('button', { class: 'chip-btn pt-btn', type: 'button', 'aria-pressed': 'false' }, h('span', { class: 'pt-tag', 'aria-hidden': 'true' }, 'PT'), h('span', null, 'Português'));
      ptBtn.addEventListener('click', function () { setPt(ptEl.hidden); });
      tools.appendChild(ptBtn);
    }
    function setPt(v) {
      if (!ptEl || !ptBtn) return;
      ptEl.hidden = !v;
      ptBtn.setAttribute('aria-pressed', v ? 'true' : 'false');
    }
    function setHidden(v) {
      textEl.classList.toggle('blurred', !!v);
      textEl.setAttribute('aria-hidden', v ? 'true' : 'false');
      revealBtn.hidden = !v;
      if (ptBtn) { ptBtn.hidden = !!v; if (v) setPt(false); }
    }
    function play() {
      SP.say(spoken, line.who, {
        fx: fx,
        onstart: function () { setSpeaking(true); },
        onend: function () { setSpeaking(false); }
      });
    }
    function setSpeaking(v) { el.classList.toggle('speaking', !!v); }
    main.addEventListener('click', play);

    if (isYou && opts.mic !== false) {
      var mic = sayItButton(text, result);
      if (mic) tools.appendChild(mic);
    }
    if (opts.hidden) setHidden(true);
    return { el: el, play: play, setHidden: setHidden, setPt: setPt, reveal: function () { setHidden(false); }, setSpeaking: setSpeaking };
  }

  /* "Say it": speech recognition practice (only where the browser supports it). */
  function sayItButton(target, host) {
    if (!SP.hasRec) return null;
    var label = h('span', null, 'Say it');
    var btn = h('button', { class: 'chip-btn', type: 'button' }, icon('mic'), label);
    var listening = false, stopFn = null;
    function reset() { listening = false; btn.classList.remove('rec'); label.textContent = 'Say it'; }
    btn.addEventListener('click', function () {
      if (listening) { if (stopFn) stopFn(); return; }
      listening = true;
      btn.classList.add('rec');
      label.textContent = 'Listening… speak now';
      clear(host);
      stopFn = SP.listen({
        result: function (alts) { renderSayResult(host, SP.compare(alts, target)); },
        error: function (code) {
          var m = micError(code);
          clear(host);
          if (m) host.appendChild(h('div', { class: 'say-box bad' }, h('p', null, m[0]), pt(m[1])));
          reset();
        },
        end: reset
      });
    });
    return btn;
  }
  function micError(code) {
    if (code === 'not-allowed' || code === 'service-not-allowed') return ['The microphone is not allowed here. Open the website in Safari or Chrome, allow the microphone and try again.', 'O microfone não está liberado aqui. Abra o site no Safari ou no Chrome, permita o microfone e tente de novo.'];
    if (code === 'no-speech') return ['I didn’t hear anything. Tap “Say it” and speak clearly.', 'Não ouvi nada. Toque em “Say it” e fale com clareza.'];
    if (code === 'audio-capture') return ['No microphone was found on this device.', 'Nenhum microfone foi encontrado neste aparelho.'];
    if (code === 'network') return ['Speaking practice needs an internet connection.', 'A prática de fala precisa de internet.'];
    if (code === 'aborted') return null;
    if (code === 'unsupported') return ['This browser can’t listen. Try Chrome or Safari.', 'Este navegador não consegue ouvir. Tente o Chrome ou o Safari.'];
    return ['Speaking practice didn’t work this time. Try again.', 'A prática de fala não funcionou desta vez. Tente de novo.'];
  }
  function renderSayResult(host, r) {
    clear(host);
    var level = r.score >= 0.85 ? 'good' : r.score >= 0.6 ? 'ok' : 'bad';
    var msg = level === 'good' ? ['Excellent!', 'Excelente!'] : level === 'ok' ? ['Good! Almost perfect.', 'Bom! Quase perfeito.'] : ['Try again. Listen, then repeat.', 'Tente de novo. Ouça e repita.'];
    host.appendChild(h('div', { class: 'say-box ' + level },
      h('p', { class: 'say-msg' }, h('strong', null, msg[0]), ptOn() ? h('span', { class: 'pt-inline', lang: 'pt-BR' }, ' · ' + msg[1]) : null),
      h('p', { class: 'say-words' }, r.words.map(function (w) { return h('span', { class: w.ok ? 'w-ok' : 'w-miss' }, w.w + ' '); })),
      h('p', { class: 'say-heard' }, 'I heard: “' + r.heard + '”')));
  }

  /* ---------- overlay ---------- */
  var overlayEl = null;
  function openOverlay(content) {
    closeOverlay();
    overlayEl = h('div', { class: 'overlay' }, content);
    overlayEl.addEventListener('click', function (e) { if (e.target === overlayEl) closeOverlay(); });
    document.body.appendChild(overlayEl);
    document.body.classList.add('no-scroll');
    var f = overlayEl.querySelector('button');
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function closeOverlay() {
    if (!overlayEl) return;
    overlayEl.parentNode.removeChild(overlayEl);
    overlayEl = null;
    document.body.classList.remove('no-scroll');
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

  /* ---------- signs ---------- */
  function pictogram(id, fallback) {
    var art = window.HD_PICTOGRAMS && window.HD_PICTOGRAMS[id];
    if (!art) return fallback;
    var s = h('span', { class: 'picto' });
    s.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' + art + '</svg>';
    return s;
  }
  function signEl(id, extra) {
    var s = C.signs[id];
    return h('span', { class: 'sign k-' + s.kind + (extra ? ' ' + extra : '') },
      h('span', { class: 'sign-pic' + (s.kind === 'rule' ? ' no' : ''), 'aria-hidden': 'true' }, pictogram(id, s.e)),
      h('span', { class: 'sign-words' },
        h('span', { class: 'sign-en' }, s.en),
        s.ar ? h('span', { class: 'sign-ar', lang: 'ar', dir: 'rtl' }, s.ar) : null),
      s.kind === 'dir' ? icon('arrow', 'sign-arrow') : null);
  }

  function stampDate(iso) {
    var d = iso ? new Date(iso) : new Date();
    try { return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(); }
    catch (e) { return d.toDateString(); }
  }
  function stampEl(stop, iso, big) {
    return h('div', { class: 'stamp' + (big ? ' big' : '') },
      h('span', { class: 'stamp-top' }, stop.journey.id === 'flight' ? 'In flight' : 'DXB · Dubai'),
      h('span', { class: 'stamp-icon', 'aria-hidden': 'true' }, sceneThumb(stop)),
      h('span', { class: 'stamp-name' }, stop.title),
      h('span', { class: 'stamp-date' }, stampDate(iso)));
  }

  /* ================================================================ home */

  function dubaiTime() {
    try { return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }

  function nextStep() {
    var any = Object.keys(store.progress).length > 0;
    for (var i = 0; i < stops.length; i++) {
      var p = stopProgress(stops[i]);
      if (p.done < p.total) return { href: '#' + stops[i].id, label: (any ? 'Continue: ' : 'Start: ') + stops[i].title };
    }
    return { href: '#' + stops[0].id, label: 'Practise again from the start' };
  }

  function viewHome() {
    var root = h('div', { class: 'page' });
    root.appendChild(topbar());
    var main = h('main', { class: 'wrap home' });
    var next = nextStep();

    main.appendChild(h('section', { class: 'hero' },
      h('p', { class: 'kicker' }, 'Dubai International · DXB'),
      h('h1', null, 'Welcome to Dubai'),
      h('p', { class: 'hero-ar', lang: 'ar', dir: 'rtl' }, 'مرحباً بكم في دبي'),
      h('p', { class: 'lede' }, 'Practise the English you need for the trip: on the plane, at the airport and in the taxi. Look, listen and answer.'),
      pt('Pratique o inglês que você vai usar na viagem: no avião, no aeroporto e no táxi. Veja, ouça e responda.'),
      h('div', { class: 'hero-actions' },
        h('a', { class: 'btn btn-primary', href: next.href }, next.label, icon('forward')))));

    main.appendChild(audioNotice());
    journeys.forEach(function (j) { main.appendChild(board(j)); });
    main.appendChild(stampsSection());

    main.appendChild(h('section', { class: 'tools' },
      h('a', { class: 'tool', href: '#phrasebook' },
        h('span', { class: 'tool-ico' }, icon('book')),
        h('span', { class: 'tool-main' }, h('span', { class: 'tool-title' }, 'Phrasebook'),
          h('span', { class: 'tool-desc' }, 'Sentences to play or show at the airport, also for grandma and the nanny'),
          pt('Frases para tocar ou mostrar no aeroporto, também para a vovó e a babá', 'span', 'block'))),
      h('a', { class: 'tool', href: '#options' },
        h('span', { class: 'tool-ico' }, icon('sliders')),
        h('span', { class: 'tool-main' }, h('span', { class: 'tool-title' }, 'Settings'),
          h('span', { class: 'tool-desc' }, 'Sound, voices, slow speech, Portuguese help'),
          pt('Som, vozes, fala lenta, ajuda em português', 'span', 'block')))));

    main.appendChild(h('section', { class: 'soon' },
      h('h2', null, 'Next journeys'),
      h('p', { class: 'muted' }, 'More situations for your new life in Dubai are coming.'),
      h('ul', { class: 'soon-list' }, C.comingSoon.map(function (s) {
        return h('li', null, h('span', { class: 'soon-ico', 'aria-hidden': 'true' }, s.icon),
          h('span', null, h('strong', null, s.title), h('span', { class: 'muted' }, ' · ' + s.sub),
            ptOn() ? h('span', { class: 'pt-inline', lang: 'pt-BR' }, ' (' + s.pt + ')') : null));
      }))));

    root.appendChild(main);
    return root;
  }

  function board(j) {
    var clock = h('span', { class: 'bh-clock' }, dubaiTime());
    var t = setInterval(function () { clock.textContent = dubaiTime(); }, 20000);
    cleanup.push(function () { clearInterval(t); });
    var rows = j.stops.map(function (s, i) {
      var p = stopProgress(s);
      var status = p.done === 0 ? h('span', { class: 'br-status st-ready' }, 'Start')
        : p.done < p.total ? h('span', { class: 'br-status st-progress' }, p.done + '/' + p.total)
        : h('span', { class: 'br-status st-done' }, icon('check'), 'Done');
      return h('a', { class: 'board-row', href: '#' + s.id },
        h('span', { class: 'br-num' }, (i < 9 ? '0' : '') + (i + 1)),
        h('span', { class: 'br-ico', 'aria-hidden': 'true' }, sceneThumb(s)),
        h('span', { class: 'br-main' }, h('span', { class: 'br-title' }, s.title),
          h('span', { class: 'br-sub' }, ptOn() ? s.pt : s.sub)),
        status);
    });
    return h('section', { class: 'board', 'aria-label': j.title },
      h('div', { class: 'board-head' },
        h('span', { class: 'bh-title' }, j.board),
        h('span', { class: 'bh-ar', lang: 'ar', dir: 'rtl' }, j.boardAr),
        h('span', { class: 'bh-time' }, h('span', { class: 'bh-label' }, 'Dubai '), clock)),
      h('div', { class: 'board-cols', 'aria-hidden': 'true' },
        h('span', null, 'Step'), h('span', { class: 'bc-where' }, j.title), h('span', null, 'Status')),
      rows);
  }

  function stampsSection() {
    var got = stops.filter(function (s) { return !!store.stamps[s.id]; }).length;
    return h('section', { class: 'stamps-sec' },
      h('div', { class: 'sec-head' }, h('h2', null, 'My passport stamps'), h('span', { class: 'count' }, got + ' of ' + stops.length)),
      h('div', { class: 'stamp-row' }, stops.map(function (s) {
        var has = !!store.stamps[s.id];
        return h('a', { class: 'mini-stamp' + (has ? ' got' : ''), href: '#' + s.id, title: s.title,
          'aria-label': s.title + (has ? ': stamp collected' : ': no stamp yet') },
          h('span', { 'aria-hidden': 'true' }, sceneThumb(s)));
      })),
      h('p', { class: 'muted small' }, 'Finish every activity at a stop to get its stamp.'),
      pt('Termine todas as atividades de uma etapa para ganhar o carimbo.', 'p', 'small'));
  }

  /* ================================================================ stop page */

  function viewStop(stop) {
    var j = stop.journey;
    var idx = j.stops.indexOf(stop);
    var flat = stops.indexOf(stop);
    var root = h('div', { class: 'page' });
    root.appendChild(topbar({ back: { href: '#', label: 'Journey' } }));
    var main = h('main', { class: 'wrap' });

    main.appendChild(h('div', { class: 'stop-sign' },
      h('span', { class: 'ss-num' }, String(idx + 1)),
      h('div', { class: 'ss-text' },
        h('p', { class: 'ss-journey' }, j.title),
        h('h1', null, stop.title),
        stop.ar ? h('p', { class: 'ss-ar', lang: 'ar', dir: 'rtl' }, stop.ar) : null,
        ptOn() ? h('p', { class: 'ss-pt', lang: 'pt-BR' }, stop.pt) : null),
      h('span', { class: 'ss-tile', 'aria-hidden': 'true' }, sceneThumb(stop))));

    var listenBtn = h('button', { class: 'chip-btn', type: 'button' }, icon('volume'), h('span', null, 'Listen'));
    listenBtn.addEventListener('click', function () { SP.say(stop.intro, 'teacher'); });
    var sceneKey = Keys.scene(stop);
    main.appendChild(h('section', { class: 'scene' },
      hasPic(sceneKey)
        ? h('figure', { class: 'scene-figure' }, pic(sceneKey, stop.intro, h('div', { class: 'scene-art', 'aria-hidden': 'true' }, stop.scene)))
        : h('div', { class: 'scene-art', 'aria-hidden': 'true' }, stop.scene),
      h('p', { class: 'lede' }, stop.intro),
      pt(stop.introPt),
      h('div', null, listenBtn)));

    var acts = activitiesOf(stop);
    main.appendChild(h('section', { class: 'acts-sec' },
      h('h2', null, 'Activities', ptOn() ? h('span', { class: 'h-pt', lang: 'pt-BR' }, ' · Atividades') : null),
      h('ol', { class: 'acts' }, acts.map(function (a, i) {
        var p = store.progress[pkey(stop, a)];
        return h('li', null, h('a', { class: 'act-row' + (p ? ' done' : ''), href: '#' + pkey(stop, a) },
          h('span', { class: 'ar-num' }, p ? icon('check') : String(i + 1)),
          h('span', { class: 'ar-main' }, h('span', { class: 'ar-title' }, ACT[a].title),
            h('span', { class: 'ar-desc' }, ptOn() ? ACT[a].pt + ' · ' + ACT[a].desc : ACT[a].desc)),
          h('span', { class: 'ar-score' }, p ? (p.total ? p.best + '/' + p.total : 'Done') : ''),
          icon('forward', 'ar-go')));
      }))));

    if (stop.tips && stop.tips.length) {
      main.appendChild(h('section', { class: 'tips' },
        h('h2', null, icon('info'), 'Good to know', ptOn() ? h('span', { class: 'h-pt', lang: 'pt-BR' }, ' · Bom saber') : null),
        h('ul', null, stop.tips.map(function (t) { t = tr(t); return h('li', null, h('span', null, t.t), pt(t.pt, 'span', 'block')); }))));
    }

    if (store.stamps[stop.id]) {
      main.appendChild(h('section', { class: 'stop-stamp' }, stampEl(stop, store.stamps[stop.id]),
        h('p', { class: 'muted' }, 'You collected this stamp. You can practise again any time.')));
    }

    var prev = stops[flat - 1], nxt = stops[flat + 1];
    main.appendChild(h('nav', { class: 'stop-nav', 'aria-label': 'Other stops' },
      prev ? h('a', { class: 'btn', href: '#' + prev.id }, icon('back'), prev.title) : h('span'),
      nxt ? h('a', { class: 'btn', href: '#' + nxt.id }, nxt.title, icon('forward')) : h('a', { class: 'btn', href: '#' }, 'Journey', icon('forward'))));

    root.appendChild(main);
    return root;
  }

  /* ================================================================ activity page */

  var RUN = {};

  function viewActivity(stop, act) {
    var root = h('div', { class: 'page' });
    root.appendChild(topbar({ back: { href: '#' + stop.id, label: stop.title } }));
    var main = h('main', { class: 'wrap act' });
    var acts = activitiesOf(stop);
    var i = acts.indexOf(act);
    main.appendChild(h('div', { class: 'act-head' },
      h('p', { class: 'kicker' }, stop.title + ' · ' + (i + 1) + ' of ' + acts.length),
      h('h1', null, ACT[act].title),
      pt(ACT[act].pt, 'p', 'act-pt')));
    main.appendChild(audioNotice());
    var body = h('div', { class: 'act-body' });
    main.appendChild(body);
    var ctx = {
      stop: stop, act: act, body: body,
      finish: function (score, total) { showResult(ctx, score, total); }
    };
    RUN[act](ctx);
    root.appendChild(main);
    return root;
  }

  function showResult(ctx, score, total) {
    SP.stop();
    var key = pkey(ctx.stop, ctx.act);
    var prev = store.progress[key];
    var best = total ? Math.max(score, (prev && prev.best) || 0) : 0;
    store.progress[key] = { best: best, total: total || 0, at: Date.now() };
    var p = stopProgress(ctx.stop);
    var newStamp = false;
    if (p.done === p.total && !store.stamps[ctx.stop.id]) {
      store.stamps[ctx.stop.id] = new Date().toISOString();
      newStamp = true;
    }
    save();

    var ratio = total ? score / total : 1;
    var title = ratio === 1 ? ['Excellent!', 'Excelente!'] : ratio >= 0.7 ? ['Well done!', 'Muito bem!']
      : ratio >= 0.4 ? ['Good try!', 'Boa tentativa!'] : ['Keep practising!', 'Continue praticando!'];
    var acts = activitiesOf(ctx.stop);
    var nextAct = acts[acts.indexOf(ctx.act) + 1];
    var nextStop = stops[stops.indexOf(ctx.stop) + 1];
    var next = nextAct ? { href: '#' + pkey(ctx.stop, nextAct), label: 'Next: ' + ACT[nextAct].title }
      : nextStop ? { href: '#' + nextStop.id, label: 'Next stop: ' + nextStop.title }
      : { href: '#', label: 'Back to the journey' };

    clear(ctx.body);
    var retry = h('button', { class: 'btn', type: 'button' }, icon('retry'), 'Try again');
    retry.addEventListener('click', render);
    ctx.body.appendChild(h('section', { class: 'result pop-in', 'aria-live': 'polite' },
      h('div', { class: 'result-badge' + (ratio >= 0.7 ? ' good' : ' ok') }, icon('check')),
      h('h2', null, title[0]),
      pt(title[1]),
      total ? h('p', { class: 'result-score' }, h('strong', null, score + ' of ' + total), ' correct the first time')
            : h('p', { class: 'result-score' }, 'Activity complete'),
      total && ratio < 1 ? h('p', { class: 'muted' }, 'Try again to improve. We keep your best score.') : null,
      h('div', { class: 'result-actions' },
        h('a', { class: 'btn btn-primary', href: next.href }, next.label, icon('forward')),
        retry)));
    window.scrollTo(0, 0);
    if (newStamp) later(function () { showStamp(ctx.stop); }, 400);
  }

  function showStamp(stop) {
    var btn = h('button', { class: 'btn btn-primary', type: 'button' }, 'Continue');
    btn.addEventListener('click', closeOverlay);
    openOverlay(h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'New passport stamp' },
      stampEl(stop, store.stamps[stop.id], true),
      h('h2', null, 'New passport stamp!'),
      pt('Novo carimbo no passaporte!'),
      h('p', null, 'You finished every activity in “' + stop.title + '”.'),
      btn));
  }

  function progressBar(i, n) {
    return h('div', { class: 'quiz-top' },
      h('div', { class: 'quiz-progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(n), 'aria-valuenow': String(i) },
        h('span', { style: 'width:' + Math.round((i / n) * 100) + '%' })),
      h('span', { class: 'quiz-count' }, (i + 1) + ' / ' + n));
  }

  function feedback(kind, lead, en, ptText) {
    return h('div', { class: 'fb-box fb-' + kind },
      h('p', null, h('strong', null, lead + ' '), en),
      pt(ptText));
  }

  /* ---------------------------------------------------------------- New words */
  RUN.words = function (ctx) {
    var vocab = ctx.stop.vocab;
    var body = ctx.body;
    learn();

    function learn() {
      clear(body);
      body.appendChild(instr('Tap a picture to hear the word and an example. Then play the listening game.',
        'Toque numa figura para ouvir a palavra e um exemplo. Depois, jogue o jogo de escuta.'));
      var playAll = h('button', { class: 'btn', type: 'button' }, icon('play'), h('span', null, 'Play all words'));
      var cards = [];
      playAll.addEventListener('click', function () {
        if (SP.busy) { SP.stop(); return; }
        playAll.lastChild.textContent = 'Stop';
        SP.sayAll(vocab.map(function (v) { return { text: v.w, who: 'teacher' }; }), {
          onItem: function (i) { cards.forEach(function (c, k) { c.classList.toggle('speaking', k === i); }); },
          onDone: function () { cards.forEach(function (c) { c.classList.remove('speaking'); }); playAll.lastChild.textContent = 'Play all words'; }
        });
      });
      body.appendChild(h('div', { class: 'controls' }, playAll));
      var grid = h('div', { class: 'vgrid' });
      vocab.forEach(function (v) {
        var card = h('button', { class: 'vcard', type: 'button', 'aria-expanded': 'false' },
          pic(Keys.vocab(ctx.stop, v), '', h('span', { class: 'v-emoji', 'aria-hidden': 'true' }, v.e), 'v-img'),
          h('span', { class: 'v-word' }, v.w),
          ptOn() && v.pt ? h('span', { class: 'v-pt', lang: 'pt-BR' }, v.pt) : null,
          h('span', { class: 'v-more' },
            h('span', { class: 'v-ex' }, v.ex),
            ptOn() && v.exPt ? h('span', { class: 'v-expt', lang: 'pt-BR' }, v.exPt) : null,
            v.note ? h('span', { class: 'v-note' }, ptOn() && v.notePt ? v.notePt : v.note) : null));
        card.addEventListener('click', function () {
          card.classList.add('open');
          card.setAttribute('aria-expanded', 'true');
          SP.sayAll([{ text: v.w, who: 'teacher' }, { text: v.ex, who: 'teacher' }], {
            onItem: function () { card.classList.add('speaking'); },
            onDone: function () { card.classList.remove('speaking'); }
          });
        });
        cards.push(card);
        grid.appendChild(card);
      });
      body.appendChild(grid);
      var go = h('button', { class: 'btn btn-primary', type: 'button' }, 'Start the listening game', icon('forward'));
      go.addEventListener('click', quiz);
      body.appendChild(h('div', { class: 'act-foot' }, go));
    }

    function quiz() {
      var qs = shuffle(vocab).slice(0, Math.min(8, vocab.length));
      var i = 0, score = 0;
      next();

      function next() {
        if (i >= qs.length) { ctx.finish(score, qs.length); return; }
        var target = qs[i];
        var tried = false, solved = false;
        var opts = shuffle([target].concat(shuffle(vocab.filter(function (v) { return v !== target; })).slice(0, 3)));
        clear(body);
        body.appendChild(progressBar(i, qs.length));
        var word = h('p', { class: 'reveal-word', hidden: true }, target.w);
        var big = h('button', { class: 'big-listen', type: 'button', 'aria-label': 'Listen to the word' }, icon('volume'));
        big.addEventListener('click', function () { SP.say(target.w, 'teacher'); });
        var showWord = h('button', { class: 'link-btn', type: 'button' }, 'Show the word');
        showWord.addEventListener('click', function () { word.hidden = false; showWord.hidden = true; });
        body.appendChild(h('div', { class: 'quiz-prompt' },
          h('p', { class: 'quiz-q' }, 'Listen. Which picture is it?'),
          pt('Ouça. Qual é a figura?'),
          big, word, showWord));
        var grid = h('div', { class: 'pic-grid' });
        opts.forEach(function (o) {
          var label = h('span', { class: 'pic-label' }, '');
          var tile = h('button', { class: 'pic', type: 'button', 'aria-label': 'Picture ' + o.w },
            pic(Keys.vocab(ctx.stop, o), '', h('span', { class: 'pic-emoji', 'aria-hidden': 'true' }, o.e), 'pic-img'), label);
          tile.addEventListener('click', function () {
            if (solved) return;
            label.textContent = o.w;
            if (o === target) {
              solved = true;
              if (!tried) score++;
              tile.classList.add('is-right');
              grid.querySelectorAll('.pic').forEach(function (b) { b.disabled = true; });
              word.hidden = false; showWord.hidden = true;
              i++;
              later(next, 1300);
            } else {
              tried = true;
              tile.classList.add('is-wrong');
              tile.disabled = true;
              shake(tile);
            }
          });
          grid.appendChild(tile);
        });
        body.appendChild(grid);
        later(function () { SP.say(target.w, 'teacher'); }, 250);
      }
    }
  };

  /* ---------------------------------------------------------------- Listen */
  RUN.listen = function (ctx) {
    var d = ctx.stop.dialogue;
    var body = ctx.body;
    var textOn = store.settings.text !== false;
    body.appendChild(instr('Press play and listen to the conversation. Tap any line to hear it again. Then answer the questions.',
      'Aperte play e ouça a conversa. Toque em qualquer frase para ouvir de novo. Depois, responda às perguntas.'));

    var playLabel = h('span', null, 'Play the conversation');
    var playBtn = h('button', { class: 'btn btn-primary', type: 'button' }, icon('play'), playLabel);
    var textLabel = h('span', null, '');
    var textBtn = h('button', { class: 'btn', type: 'button' });
    var controls = h('div', { class: 'controls' }, playBtn, textBtn);
    body.appendChild(controls);

    var chat = h('div', { class: 'chat' });
    var bubbles = d.lines.map(function (line) {
      var b = makeBubble(line, { hidden: !textOn });
      chat.appendChild(b.el);
      return b;
    });
    body.appendChild(chat);

    if (ptOn()) {
      var ptAllOn = false;
      var ptAll = h('button', { class: 'btn', type: 'button', 'aria-pressed': 'false' }, icon('globe'), h('span', null, 'Português'));
      ptAll.addEventListener('click', function () {
        ptAllOn = !ptAllOn;
        ptAll.setAttribute('aria-pressed', ptAllOn ? 'true' : 'false');
        if (ptAllOn && !textOn) { textOn = true; bubbles.forEach(function (b) { b.setHidden(false); }); paintText(); }
        bubbles.forEach(function (b) { b.setPt(ptAllOn); });
      });
      controls.appendChild(ptAll);
    }

    function paintText() {
      clear(textBtn);
      add(textBtn, [icon(textOn ? 'eyeoff' : 'eye'), textLabel]);
      textLabel.textContent = textOn ? 'Hide the words' : 'Show the words';
      textBtn.setAttribute('aria-pressed', textOn ? 'false' : 'true');
    }
    paintText();
    textBtn.addEventListener('click', function () {
      textOn = !textOn;
      store.settings.text = textOn;
      save();
      bubbles.forEach(function (b) { b.setHidden(!textOn); });
      paintText();
    });

    var playing = false;
    function paintPlay() {
      playBtn.replaceChild(icon(playing ? 'stop' : 'play'), playBtn.firstChild);
      playLabel.textContent = playing ? 'Stop' : 'Play the conversation';
    }
    playBtn.addEventListener('click', function () {
      if (playing) { SP.stop(); return; }
      playing = true; paintPlay();
      SP.sayAll(d.lines.map(function (l) { return { text: l.say || l.t, who: l.who }; }), {
        onItem: function (i) {
          bubbles.forEach(function (b, k) { b.setSpeaking(k === i); });
          scrollSoft(bubbles[i].el);
        },
        onDone: function () {
          bubbles.forEach(function (b) { b.setSpeaking(false); });
          playing = false; paintPlay();
        }
      });
    });

    var finishBtn = h('button', { class: 'btn btn-primary', type: 'button', disabled: true }, 'See my result', icon('forward'));
    var score = 0;
    var qs = d.questions || [];
    if (qs.length) {
      body.appendChild(questionsBlock(qs, function (firstTry) { score = firstTry; finishBtn.disabled = false; scrollSoft(finishBtn); }));
    } else {
      finishBtn.disabled = false;
    }
    finishBtn.addEventListener('click', function () { ctx.finish(qs.length ? score : 0, qs.length); });
    body.appendChild(h('div', { class: 'act-foot' }, finishBtn));
  };

  function questionsBlock(questions, onAll) {
    var wrap = h('section', { class: 'questions' }, h('h2', null, 'Did you understand?'), pt('Você entendeu?'));
    var answered = 0, firstTry = 0;
    questions.forEach(function (q, qi) {
      var correct = q.a[0];
      var tried = false, solved = false;
      var read = h('button', { class: 'icon-btn sm', type: 'button', 'aria-label': 'Read the question aloud' }, icon('volume'));
      read.addEventListener('click', function () { SP.say(q.q, 'teacher'); });
      var grid = h('div', { class: 'options' });
      var fb = h('div', { class: 'fb', 'aria-live': 'polite' });
      shuffle(q.a).forEach(function (o) {
        var btn = h('button', { class: 'option', type: 'button' }, o);
        btn.addEventListener('click', function () {
          if (solved) return;
          if (o === correct) {
            solved = true;
            btn.classList.add('is-right');
            grid.querySelectorAll('.option').forEach(function (b) { b.disabled = true; });
            clear(fb);
            answered++;
            if (!tried) firstTry++;
            if (answered === questions.length) onAll(firstTry, questions.length);
          } else {
            tried = true;
            btn.classList.add('is-wrong');
            btn.disabled = true;
            shake(btn);
            clear(fb);
            fb.appendChild(feedback('bad', 'Not quite.', 'Listen to the conversation again and try another answer.', 'Ouça a conversa de novo e tente outra resposta.'));
          }
        });
        grid.appendChild(btn);
      });
      wrap.appendChild(h('div', { class: 'q-card' },
        h('div', { class: 'q-head' }, h('div', null, h('p', { class: 'q-text' }, (qi + 1) + '. ' + q.q), pt(q.pt)), read),
        grid, fb));
    });
    return wrap;
  }

  /* ---------------------------------------------------------------- Fill the gaps */
  RUN.gaps = function (ctx) {
    var d = ctx.stop.dialogue;
    var body = ctx.body;
    body.appendChild(instr('Listen and complete the conversation. The yellow gap is selected: tap a word below to put it there. Tap a filled gap to change it.',
      'Ouça e complete a conversa. A lacuna amarela está selecionada: toque numa palavra abaixo para colocá-la ali. Toque numa lacuna preenchida para trocar.'));

    var playLabel = h('span', null, 'Play the conversation');
    var playBtn = h('button', { class: 'btn btn-primary', type: 'button' }, icon('play'), playLabel);
    body.appendChild(h('div', { class: 'controls' }, playBtn));

    var blanks = [];
    var rows = [];
    var list = h('div', { class: 'gap-lines' });
    d.lines.forEach(function (line, li) {
      var ch = C.characters[line.who];
      var row = h('div', { class: 'gap-line' + (line.who === 'you' ? ' you' : '') });
      var play = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Play line ' + (li + 1) + ', ' + ch.name }, icon('play'));
      play.addEventListener('click', function () {
        SP.say(line.say || line.t, line.who, {
          onstart: function () { row.classList.add('speaking'); },
          onend: function () { row.classList.remove('speaking'); }
        });
      });
      var text = h('p', { class: 'gap-text' }, h('span', { class: 'gap-who' }, ch.name));
      line.t.split(/(\[[^\]]+\])/).forEach(function (part) {
        if (!part) return;
        var m = part.match(/^\[(.+)\]$/);
        if (m) {
          var b = { answer: m[1], value: null, chip: null, locked: false };
          b.el = h('button', { class: 'gap', type: 'button', 'aria-label': 'Gap ' + (blanks.length + 1) + ', empty' }, ' ');
          b.el.addEventListener('click', function () { onBlank(b); });
          blanks.push(b);
          text.appendChild(b.el);
        } else {
          text.appendChild(document.createTextNode(part));
        }
      });
      row.appendChild(play);
      row.appendChild(avatarOf(line.who));
      row.appendChild(text);
      rows.push(row);
      list.appendChild(row);
    });
    body.appendChild(list);

    var playing = false;
    playBtn.addEventListener('click', function () {
      if (playing) { SP.stop(); return; }
      playing = true;
      playBtn.replaceChild(icon('stop'), playBtn.firstChild);
      playLabel.textContent = 'Stop';
      SP.sayAll(d.lines.map(function (l) { return { text: l.say || l.t, who: l.who }; }), {
        onItem: function (i) {
          rows.forEach(function (r, k) { r.classList.toggle('speaking', k === i); });
          scrollSoft(rows[i]);
        },
        onDone: function () {
          rows.forEach(function (r) { r.classList.remove('speaking'); });
          playing = false;
          playBtn.replaceChild(icon('play'), playBtn.firstChild);
          playLabel.textContent = 'Play the conversation';
        }
      });
    });

    var chips = shuffle(blanks.map(function (b) { return b.answer; }).concat(d.extra || [])).map(function (w) {
      var c = { w: w, used: false };
      c.el = h('button', { class: 'chip', type: 'button' }, w);
      c.el.addEventListener('click', function () { onChip(c); });
      return c;
    });
    var fb = h('div', { class: 'bank-fb', 'aria-live': 'polite' });
    var checkBtn = h('button', { class: 'btn btn-primary', type: 'button', disabled: true }, icon('check'), 'Check');
    var answersBtn = h('button', { class: 'btn', type: 'button', hidden: true }, 'Show answers');
    var finishBtn = h('button', { class: 'btn btn-primary', type: 'button', hidden: true }, 'See my result', icon('forward'));
    var bank = h('div', { class: 'bank' },
      h('div', { class: 'bank-chips' }, chips.map(function (c) { return c.el; })),
      fb,
      h('div', { class: 'bank-actions' }, checkBtn, answersBtn, finishBtn));
    body.appendChild(bank);

    var active = blanks[0] || null;
    var firstScore = null;
    blanks.forEach(function (b) { b.el.classList.toggle('active', b === active); });

    function setFb(kind, en, ptText) {
      clear(fb);
      fb.className = 'bank-fb' + (kind ? ' ' + kind : '');
      add(fb, [h('p', null, en), pt(ptText)]);
    }
    function onBlank(b) {
      if (b.locked) return;
      if (b.value) returnChip(b);
      active = b;
      paintActive();
    }
    function onChip(c) {
      if (c.used) return;
      if (!active) active = nextEmpty(null);
      if (!active) return;
      if (active.value) returnChip(active);
      active.value = c.w;
      active.chip = c;
      c.used = true;
      c.el.disabled = true;
      c.el.classList.add('used');
      active.el.textContent = c.w;
      active.el.classList.add('filled');
      active.el.classList.remove('is-wrong');
      active.el.setAttribute('aria-label', 'Gap ' + (blanks.indexOf(active) + 1) + ': ' + c.w);
      active = nextEmpty(active);
      paintActive();
      update();
    }
    function returnChip(b) {
      if (b.chip) { b.chip.used = false; b.chip.el.disabled = false; b.chip.el.classList.remove('used'); }
      b.value = null; b.chip = null;
      b.el.textContent = ' ';
      b.el.classList.remove('filled', 'is-wrong');
      b.el.setAttribute('aria-label', 'Gap ' + (blanks.indexOf(b) + 1) + ', empty');
      update();
    }
    function nextEmpty(from) {
      var start = from ? blanks.indexOf(from) : -1;
      for (var k = 1; k <= blanks.length; k++) {
        var b = blanks[(start + k + blanks.length) % blanks.length];
        if (!b.value && !b.locked) return b;
      }
      return null;
    }
    function paintActive() {
      blanks.forEach(function (b) { b.el.classList.toggle('active', b === active); });
      if (active) keepVisible(active.el);
    }
    // The word bank is pinned to the bottom of the screen: never let it hide the selected gap.
    function keepVisible(el) {
      requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        var bankTop = bank.getBoundingClientRect().top;
        if (r.bottom > bankTop - 12) window.scrollBy({ top: r.bottom - bankTop + 48, behavior: 'smooth' });
        else if (r.top < 72) window.scrollBy({ top: r.top - 96, behavior: 'smooth' });
      });
    }
    function update() { checkBtn.disabled = !blanks.every(function (b) { return !!b.value; }); }

    checkBtn.addEventListener('click', function () {
      var right = 0;
      blanks.forEach(function (b) {
        if (b.locked) { right++; return; }
        if (same(b.value, b.answer)) {
          right++;
          b.locked = true;
          b.el.classList.add('is-right');
          b.el.disabled = true;
        } else {
          b.el.classList.add('is-wrong');
          shake(b.el);
        }
      });
      if (firstScore === null) firstScore = right;
      if (right === blanks.length) {
        setFb('good', 'All correct. Great listening!', 'Tudo certo. Ótima escuta!');
        checkBtn.hidden = true; answersBtn.hidden = true; finishBtn.hidden = false;
        lockChips();
      } else {
        var wrong = blanks.length - right;
        setFb('bad', wrong + (wrong === 1 ? ' gap is' : ' gaps are') + ' not correct (red). Listen again, then tap a red gap to change it.',
          wrong + (wrong === 1 ? ' lacuna não está certa' : ' lacunas não estão certas') + ' (em vermelho). Ouça de novo e toque numa lacuna vermelha para trocar.');
        answersBtn.hidden = false;
        checkBtn.disabled = true;
        active = null;
        paintActive();
      }
    });
    answersBtn.addEventListener('click', function () {
      blanks.forEach(function (b) {
        if (b.locked) return;
        b.el.textContent = b.answer;
        b.el.classList.remove('is-wrong', 'active');
        b.el.classList.add('shown');
        b.el.disabled = true;
        b.locked = true;
      });
      setFb('', 'Here are the answers. Play the conversation again and read along.', 'Aqui estão as respostas. Toque a conversa de novo e acompanhe a leitura.');
      checkBtn.hidden = true; answersBtn.hidden = true; finishBtn.hidden = false;
      lockChips();
    });
    function lockChips() { chips.forEach(function (c) { c.el.disabled = true; }); }
    finishBtn.addEventListener('click', function () { ctx.finish(firstScore || 0, blanks.length); });
  };

  /* ---------------------------------------------------------------- Your turn (role-play) */
  RUN.talk = function (ctx) {
    var turns = ctx.stop.roleplay;
    var body = ctx.body;
    body.appendChild(instr('You are the passenger. Listen, then choose the best answer. The words are blurred so you listen first: tap “Show words” if you need help.',
      'Você é a passageira. Ouça e escolha a melhor resposta. As palavras ficam borradas para você ouvir primeiro: toque em “Show words” se precisar de ajuda.'));
    var chat = h('div', { class: 'chat' });
    var stage = h('div', { class: 'stage', 'aria-live': 'polite' });
    body.appendChild(chat);
    body.appendChild(stage);

    var i = 0, asked = 0, firstTry = 0;
    var lastStaff = null;
    var alive = true;
    cleanup.push(function () { alive = false; });

    var start = h('button', { class: 'btn btn-primary', type: 'button' }, icon('play'), 'Start');
    start.addEventListener('click', function () { clear(stage); step(); });
    stage.appendChild(start);

    function step() {
      if (!alive) return;
      if (i >= turns.length) { end(); return; }
      var t = turns[i++];
      if (t.sit) {
        lastStaff = null;
        chat.appendChild(h('div', { class: 'sit pop-in' }, h('span', { class: 'sit-label' }, 'Situation'), h('p', null, t.sit), pt(t.pt)));
        scrollSoft(stage, 'end');
        later(step, 450);
        return;
      }
      if (t.choose) { choices(t); return; }
      var fx = Items.fxOf(t);
      var b = makeBubble(t, { hidden: t.who !== 'you', fx: fx });
      chat.appendChild(b.el);
      lastStaff = b;
      scrollSoft(stage, 'end');
      var nextIsLine = turns[i] && turns[i].who;
      SP.say(t.say || t.t, t.who, {
        fx: fx,
        onstart: function () { b.setSpeaking(true); },
        onend: function () { b.setSpeaking(false); if (nextIsLine) step(); }
      });
      if (!nextIsLine) step();
    }

    function choices(t) {
      asked++;
      var tried = false, solved = false;
      var correct = null;
      t.choose.forEach(function (o) { if (o.ok && !correct) correct = o; });
      if (!correct) correct = t.choose[0];
      clear(stage);
      var head = h('div', { class: 'stage-head' },
        h('div', null, h('p', { class: 'stage-q' }, t.ask || 'What do you say?'), pt(t.ask ? t.askPt : 'O que você diz?')));
      if (lastStaff) {
        var again = h('button', { class: 'chip-btn', type: 'button' }, icon('volume'), h('span', null, 'Listen again'));
        again.addEventListener('click', function () { lastStaff.play(); });
        head.appendChild(again);
      }
      var grid = h('div', { class: 'options' });
      var fb = h('div', { class: 'fb', 'aria-live': 'polite' });
      shuffle(t.choose).forEach(function (o) {
        var btn = h('button', { class: 'option', type: 'button' }, o.t);
        btn.addEventListener('click', function () {
          if (solved) return;
          if (o === correct) {
            solved = true;
            if (!tried) firstTry++;
            btn.classList.add('is-right');
            grid.querySelectorAll('.option').forEach(function (x) { x.disabled = true; });
            clear(fb);
            if (lastStaff) lastStaff.reveal();
            later(function () {
              clear(stage);
              if (t.ask) {
                chat.appendChild(h('div', { class: 'answer-note pop-in' }, h('span', { class: 'muted' }, t.ask + ' '), h('strong', null, o.t)));
                scrollSoft(stage, 'end');
                later(step, 500);
              } else {
                var yb = makeBubble({ who: 'you', t: o.t, say: o.say });
                chat.appendChild(yb.el);
                scrollSoft(stage, 'end');
                SP.say(o.say || o.t, 'you', {
                  onstart: function () { yb.setSpeaking(true); },
                  onend: function () { yb.setSpeaking(false); step(); }
                });
              }
            }, 550);
          } else {
            tried = true;
            btn.classList.add('is-wrong');
            btn.disabled = true;
            shake(btn);
            clear(fb);
            fb.appendChild(feedback('bad', 'Not quite.',
              o.why || t.hint || 'Listen again and try another answer.',
              o.why ? o.whyPt : t.hint ? t.hintPt : 'Ouça de novo e tente outra resposta.'));
          }
        });
        grid.appendChild(btn);
      });
      add(stage, [head, grid, fb]);
      scrollSoft(stage, 'end');
    }

    function end() {
      clear(stage);
      var done = h('button', { class: 'btn btn-primary', type: 'button' }, 'See my result', icon('forward'));
      done.addEventListener('click', function () { ctx.finish(firstTry, asked); });
      add(stage, [h('p', { class: 'stage-q' }, 'Conversation finished. Well done!'), pt('Conversa terminada. Muito bem!'), done]);
      scrollSoft(stage, 'end');
    }
  };

  /* ---------------------------------------------------------------- Learn the signs */
  RUN.signs = function (ctx) {
    var ids = ctx.stop.signs;
    var body = ctx.body;
    var seen = {};
    body.appendChild(instr('Tap a sign to hear it and see what it means. Signs at DXB are in English and Arabic.',
      'Toque numa placa para ouvir e ver o que significa. As placas no DXB estão em inglês e árabe.'));
    var count = h('p', { class: 'muted' }, '');
    function paintCount() { count.textContent = 'You opened ' + Object.keys(seen).length + ' of ' + ids.length + ' signs.'; }
    var grid = h('div', { class: 'sgrid' });
    ids.forEach(function (id) {
      var s = C.signs[id];
      var card = h('button', { class: 'sign-card', type: 'button', 'aria-expanded': 'false' },
        signEl(id),
        h('span', { class: 'sign-mean' },
          h('span', { class: 'block' }, s.mean),
          ptOn() ? h('span', { class: 'pt block', lang: 'pt-BR' }, s.pt + ': ' + s.meanPt) : null));
      card.addEventListener('click', function () {
        card.classList.add('open');
        card.setAttribute('aria-expanded', 'true');
        seen[id] = true;
        paintCount();
        SP.sayAll([{ text: s.en, who: 'teacher' }, { text: s.mean, who: 'teacher' }]);
      });
      grid.appendChild(card);
    });
    body.appendChild(grid);
    paintCount();
    var done = h('button', { class: 'btn btn-primary', type: 'button' }, 'I know these signs', icon('forward'));
    done.addEventListener('click', function () { ctx.finish(0, 0); });
    body.appendChild(h('div', { class: 'act-foot' }, count, done));
  };

  /* ---------------------------------------------------------------- Which sign? */
  RUN.signquiz = function (ctx) {
    var qs = ctx.stop.signquiz;
    var body = ctx.body;
    var i = 0, score = 0;
    next();

    function next() {
      if (i >= qs.length) { ctx.finish(score, qs.length); return; }
      var q = qs[i];
      var tried = false, solved = false;
      clear(body);
      body.appendChild(progressBar(i, qs.length));
      var read = h('button', { class: 'icon-btn sm', type: 'button', 'aria-label': 'Read the question aloud' }, icon('volume'));
      read.addEventListener('click', function () { SP.say(q.q, 'teacher'); });
      var card = h('div', { class: 'quiz-card' });
      if (q.sign) card.appendChild(signEl(q.sign, 'sign-lg'));
      card.appendChild(h('div', { class: 'q-head' }, h('div', null, h('p', { class: 'q-text big' }, q.q), pt(q.pt)), read));
      body.appendChild(card);

      var fb = h('div', { class: 'fb', 'aria-live': 'polite' });
      var nextBtn = h('button', { class: 'btn btn-primary', type: 'button', hidden: true },
        i + 1 < qs.length ? 'Next question' : 'See my result', icon('forward'));
      nextBtn.addEventListener('click', function () { i++; next(); });

      var grid = h('div', { class: q.sign ? 'options' : 'sign-options' });
      var correct = q.sign ? q.a[0] : q.opts[0];
      shuffle(q.sign ? q.a : q.opts).forEach(function (o) {
        var btn = q.sign
          ? h('button', { class: 'option', type: 'button' }, o)
          : h('button', { class: 'sign-opt', type: 'button', 'aria-label': C.signs[o].en }, signEl(o));
        btn.addEventListener('click', function () {
          if (solved) return;
          if (o === correct) {
            solved = true;
            if (!tried) score++;
            btn.classList.add('is-right');
            grid.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
            clear(fb);
            var s = q.sign ? C.signs[q.sign] : C.signs[o];
            fb.appendChild(feedback('good', 'Correct!', q.note || (s.en + ': ' + s.mean), q.note ? q.notePt : (s.pt + ': ' + s.meanPt)));
            if (!q.sign) SP.say(s.en, 'teacher');
            nextBtn.hidden = false;
            scrollSoft(nextBtn);
          } else {
            tried = true;
            btn.classList.add('is-wrong');
            btn.disabled = true;
            shake(btn);
            clear(fb);
            fb.appendChild(q.sign
              ? feedback('bad', 'Not this one.', 'Look at the sign again.', 'Olhe a placa de novo.')
              : feedback('bad', 'Not this one.', '“' + C.signs[o].en + '” means: ' + C.signs[o].mean, '“' + C.signs[o].en + '” = ' + C.signs[o].pt + '. ' + C.signs[o].meanPt));
          }
        });
        grid.appendChild(btn);
      });
      body.appendChild(grid);
      body.appendChild(fb);
      body.appendChild(h('div', { class: 'act-foot' }, nextBtn));
    }
  };

  /* ---------------------------------------------------------------- Follow the signs */
  RUN.signorder = function (ctx) {
    var order = ctx.stop.signorder;
    var hints = (ctx.stop.signorderHints || []).map(tr);
    var body = ctx.body;
    var pos = 0, mistakes = 0;
    body.appendChild(instr('You just landed at DXB with the family. Tap the signs in the order you will follow them.',
      'Vocês acabaram de pousar no DXB. Toque nas placas na ordem em que vão segui-las.'));

    var slots = order.map(function (id, k) {
      var holder = h('span', { class: 'slot-empty' });
      return { li: h('li', { class: 'slot' }, h('span', { class: 'slot-num' }, String(k + 1)), holder), holder: holder };
    });
    body.appendChild(h('ol', { class: 'route', 'aria-label': 'Your route' }, slots.map(function (s) { return s.li; })));

    var fb = h('div', { class: 'fb', 'aria-live': 'polite' });
    var hint = h('div', { class: 'route-hint' });
    function paintHint() {
      clear(hint);
      var hh = hints[pos];
      if (!hh) return;
      add(hint, [h('p', null, hh.t), pt(hh.pt)]);
    }
    paintHint();
    body.appendChild(hint);
    var pool = h('div', { class: 'pool' });
    shuffle(order).forEach(function (id) {
      var btn = h('button', { class: 'sign-opt', type: 'button', 'aria-label': C.signs[id].en }, signEl(id));
      btn.addEventListener('click', function () {
        if (id === order[pos]) {
          var slot = slots[pos];
          slot.li.classList.add('filled');
          slot.li.replaceChild(signEl(id), slot.holder);
          btn.parentNode.removeChild(btn);
          SP.say(C.signs[id].en, 'teacher');
          pos++;
          clear(fb);
          paintHint();
          if (pos >= order.length) {
            var finish = h('button', { class: 'btn btn-primary', type: 'button' }, 'See my result', icon('forward'));
            finish.addEventListener('click', function () { ctx.finish(Math.max(0, order.length - mistakes), order.length); });
            add(fb, [feedback('good', 'Perfect!', 'This is your route through the airport.', 'Este é o seu caminho pelo aeroporto.'), finish]);
            scrollSoft(finish);
          }
        } else {
          mistakes++;
          shake(btn);
          clear(fb);
          var hh = hints[pos] || { t: 'Think about what comes next.', pt: 'Pense no que vem depois.' };
          fb.appendChild(feedback('bad', 'Not yet.', hh.t, hh.pt));
        }
      });
      pool.appendChild(btn);
    });
    body.appendChild(pool);
    body.appendChild(fb);
  };

  /* ================================================================ phrasebook */

  function viewPhrases() {
    var root = h('div', { class: 'page' });
    root.appendChild(topbar({ back: { href: '#', label: 'Journey' } }));
    var main = h('main', { class: 'wrap' });
    main.appendChild(h('div', { class: 'act-head' },
      h('p', { class: 'kicker' }, 'For the real day'),
      h('h1', null, 'Phrasebook'),
      pt('Frases úteis', 'p', 'act-pt')));
    main.appendChild(instr('Tap the speaker to listen, or the turtle to listen slowly. Tap “Show” to show a sentence in big letters to a person at the airport.',
      'Toque no alto-falante para ouvir, ou na tartaruga para ouvir devagar. Toque em “Show” para mostrar a frase em letras grandes para alguém no aeroporto.'));

    var groups = [{ title: 'Essentials', pt: 'O essencial', items: C.essentials }];
    groups.push({ title: C.family.title, pt: C.family.pt, icon: '👵', items: C.family.items, note: C.family.note, notePt: C.family.notePt });
    stops.forEach(function (s) { if (s.phrases) groups.push({ title: s.title, pt: s.pt, icon: s.icon, items: s.phrases }); });
    groups.push({ title: 'Emergency', pt: 'Emergência', items: C.emergency,
      note: 'Emergency numbers in the UAE: Police 999 · Ambulance 998 · Fire 997',
      notePt: 'Números de emergência nos Emirados: Polícia 999 · Ambulância 998 · Bombeiros 997' });

    groups.forEach(function (g) {
      var sec = h('section', { class: 'phr-group' },
        h('h2', null, g.icon ? h('span', { class: 'phr-ico', 'aria-hidden': 'true' }, g.icon) : null, g.title,
          ptOn() && g.pt ? h('span', { class: 'h-pt', lang: 'pt-BR' }, ' · ' + g.pt) : null));
      if (g.note) sec.appendChild(h('div', { class: 'notice' }, h('p', null, g.note), pt(g.notePt)));
      g.items.forEach(function (item) { sec.appendChild(phraseRow(tr(item))); });
      main.appendChild(sec);
    });
    root.appendChild(main);
    return root;
  }

  function phraseRow(item) {
    var text = item.t;
    var play = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen: ' + text }, icon('volume'));
    play.addEventListener('click', function () { SP.say(text, 'you'); });
    var slow = h('button', { class: 'icon-btn emoji', type: 'button', 'aria-label': 'Listen slowly: ' + text }, h('span', { 'aria-hidden': 'true' }, '🐢'));
    slow.addEventListener('click', function () { SP.say(text, 'you', { slow: true }); });
    var show = h('button', { class: 'chip-btn', type: 'button', 'aria-label': 'Show in big letters: ' + text }, icon('expand'), h('span', null, 'Show'));
    show.addEventListener('click', function () { showBig(item); });
    var host = h('div', { class: 'say-host', 'aria-live': 'polite' });
    var tools = h('div', { class: 'phr-tools' }, play, slow, show, sayItButton(text, host));
    return h('div', { class: 'phr' }, h('div', null, h('p', { class: 'phr-text' }, text), pt(item.pt)), tools, host);
  }

  function showBig(item) {
    var play = h('button', { class: 'btn btn-primary', type: 'button' }, icon('volume'), 'Play');
    play.addEventListener('click', function () { SP.say(item.t, 'you'); });
    var close = h('button', { class: 'btn', type: 'button' }, icon('x'), 'Close');
    close.addEventListener('click', closeOverlay);
    openOverlay(h('div', { class: 'modal show-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Sentence in big letters' },
      h('p', { class: 'show-text' }, item.t),
      item.pt ? h('p', { class: 'show-pt', lang: 'pt-BR' }, item.pt) : null,
      h('div', { class: 'result-actions' }, play, close)));
  }

  /* ================================================================ settings */

  function viewOptions() {
    var root = h('div', { class: 'page' });
    root.appendChild(topbar({ back: { href: '#', label: 'Journey' } }));
    var main = h('main', { class: 'wrap' });
    main.appendChild(h('div', { class: 'act-head' },
      h('p', { class: 'kicker' }, 'Settings'),
      h('h1', null, 'Sound and help'),
      pt('Som e ajuda', 'p', 'act-pt')));

    function section(title, ptTitle) {
      return h('section', { class: 'panel' }, h('h2', null, title, ptOn() && ptTitle ? h('span', { class: 'h-pt', lang: 'pt-BR' }, ' · ' + ptTitle) : null));
    }

    /* --- test the sound --- */
    var status = h('div', { class: 'status-line' });
    var test = h('button', { class: 'btn btn-primary', type: 'button' }, icon('volume'), 'Play a test sentence');
    test.addEventListener('click', function () { SP.say(Items.TEST, 'teacher'); });
    var testSec = section('Test the sound', 'Teste o som');
    add(testSec, [
      h('div', { class: 'controls' }, test),
      status,
      h('div', { class: 'help-box' },
        h('p', null, h('strong', null, 'No sound?'), ptOn() ? h('span', { class: 'pt-inline', lang: 'pt-BR' }, ' · Sem som?') : null),
        h('ol', { class: 'plain-list' },
          h('li', null, 'iPhone: turn off silent mode with the small switch (or the Action button) on the side of the phone, then turn up the volume.', pt('iPhone: desligue o modo silencioso na chavinha (ou no botão de Ação) na lateral do celular e aumente o volume.', 'span', 'block')),
          h('li', null, 'Tap a ▶ button once more. Phones only start sound after a tap.', pt('Toque mais uma vez num botão ▶. O celular só começa o som depois de um toque.', 'span', 'block')),
          h('li', null, 'Still nothing? Open the website in Safari or Chrome instead of inside another app.', pt('Ainda nada? Abra o site no Safari ou no Chrome, e não dentro de outro aplicativo.', 'span', 'block'))))]);
    main.appendChild(testSec);

    /* --- voices --- */
    var srcSec = section('Voices', 'Vozes');
    var srcList = h('div', { class: 'accent-list', role: 'radiogroup', 'aria-label': 'Voices' });
    srcSec.appendChild(srcList);
    var accentWrap = h('div', { class: 'accent-wrap' },
      h('h3', null, 'Accent of the airport staff'),
      h('p', null, 'In Dubai you will hear English with many accents. Choose what you want to practise.'),
      pt('Em Dubai você vai ouvir inglês com muitos sotaques. Escolha o que quer praticar.'));
    var accentList = h('div', { class: 'accent-list', role: 'radiogroup', 'aria-label': 'Accent' });
    accentWrap.appendChild(accentList);
    srcSec.appendChild(accentWrap);
    if (SP.credits().length) srcSec.appendChild(h('p', { class: 'muted small' }, SP.credits().join(' · ') + '.'));
    main.appendChild(srcSec);

    var SOURCES = [
      { key: 'recorded', label: 'Recorded voices', note: 'Recommended', desc: 'Real recordings with the accents you will hear in Dubai: Emirati officers, Indian and Filipino airport staff, British cabin crew. They sound the same on every phone.',
        descPt: 'Gravações com os sotaques que você vai ouvir em Dubai: oficiais emiradenses, funcionários indianos e filipinos, tripulação britânica. Soam iguais em qualquer celular.' },
      { key: 'device', label: 'Device voices', desc: 'Your phone’s own voices. You can choose accents, also Indian English and an experimental Arabic accent.',
        descPt: 'As vozes do seu celular. Você pode escolher sotaques, inclusive inglês indiano e um sotaque árabe experimental.' }
    ];
    var ACCENT_CHOICES = [
      { key: 'mixed', label: 'Dubai mix', note: 'Recommended', desc: 'Different people have different accents, like at the real airport: British, Indian, Filipino and more.' },
      { key: 'gb', label: 'British English', desc: 'Clear and common in the UAE.' },
      { key: 'us', label: 'American English', desc: 'The accent of many films and TV series.' },
      { key: 'in', label: 'Indian English', desc: 'You will hear this accent very often in Dubai.' },
      { key: 'ar', label: 'Arabic accent', note: 'Experimental', desc: 'An Arabic voice reads the English of the officers and staff. It works on some devices only and can sound strange.' }
    ];

    /* --- speed --- */
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Speech speed' });
    var segNormal = h('button', { type: 'button' }, 'Normal');
    var segSlow = h('button', { type: 'button' }, '🐢 Slow');
    function paintSeg() {
      segNormal.setAttribute('aria-pressed', store.settings.slow ? 'false' : 'true');
      segSlow.setAttribute('aria-pressed', store.settings.slow ? 'true' : 'false');
    }
    segNormal.addEventListener('click', function () { setSlow(false); });
    segSlow.addEventListener('click', function () { setSlow(true); });
    document.addEventListener('hd:slow', paintSeg);
    cleanup.push(function () { document.removeEventListener('hd:slow', paintSeg); });
    add(seg, [segNormal, segSlow]);
    paintSeg();
    var speedSec = section('Speed', 'Velocidade');
    speedSec.appendChild(seg);
    main.appendChild(speedSec);

    /* --- Portuguese help --- */
    var ptSec = section('Portuguese help', 'Ajuda em português');
    var ptSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Portuguese help' });
    var ptYes = h('button', { type: 'button', 'aria-pressed': ptOn() ? 'true' : 'false' }, 'On · Ligada');
    var ptNo = h('button', { type: 'button', 'aria-pressed': ptOn() ? 'false' : 'true' }, 'Off · Desligada');
    ptYes.addEventListener('click', function () { store.settings.pt = true; save(); render(); });
    ptNo.addEventListener('click', function () { store.settings.pt = false; save(); render(); });
    add(ptSeg, [ptYes, ptNo]);
    add(ptSec, [
      h('p', null, 'Show translations and explanations in Brazilian Portuguese. Turn it off when you feel ready.'),
      h('p', { class: 'pt', lang: 'pt-BR' }, 'Mostra traduções e explicações em português. Desligue quando se sentir pronta.'),
      ptSeg]);
    main.appendChild(ptSec);

    /* --- who speaks --- */
    var castSec = section('Who speaks with which voice', 'Quem fala com qual voz');
    var cast = h('div', { class: 'cast' });
    castSec.appendChild(cast);
    main.appendChild(castSec);

    function paintDynamic() {
      var st = SP.status();
      var n = SP.voiceCount();
      var srcRecorded = store.settings.source !== 'device';
      clear(status);
      var lines = [];
      if (srcRecorded && SP.hasRecorded) {
        lines.push(st.media === 'broken'
          ? ['Recorded voices can’t play in this browser, so we use the device voices.', 'As gravações não tocam neste navegador, então usamos as vozes do aparelho.']
          : ['Recorded voices are ready.', 'As vozes gravadas estão prontas.']);
      }
      if (!srcRecorded || st.media === 'broken') {
        lines.push(!SP.hasTTS ? ['This browser has no device voices.', 'Este navegador não tem vozes do aparelho.']
          : n ? ['Your device has ' + n + ' voices.', 'Seu aparelho tem ' + n + ' vozes.'] : ['Looking for voices on this device…', 'Procurando vozes neste aparelho…']);
      }
      if (st.blocked) lines.push(['The browser is waiting for a tap before it plays sound.', 'O navegador está esperando um toque para tocar o som.']);
      lines.forEach(function (l) { add(status, [h('p', { class: 'muted' }, l[0]), pt(l[1])]); });

      clear(srcList);
      SOURCES.forEach(function (s) {
        var input = h('input', { type: 'radio', name: 'source', id: 'source-' + s.key, value: s.key });
        input.checked = (store.settings.source || 'recorded') === s.key;
        input.addEventListener('change', function () {
          store.settings.source = s.key; save();
          SP.setOptions({ source: s.key });
          paintDynamic();
        });
        srcList.appendChild(h('label', { class: 'accent', for: 'source-' + s.key }, input,
          h('span', { class: 'accent-main' },
            h('span', { class: 'accent-title' }, s.label, s.note ? h('span', { class: 'badge note' }, s.note) : null),
            h('span', { class: 'accent-desc' }, s.desc),
            pt(s.descPt, 'span', 'block'))));
      });

      accentWrap.hidden = srcRecorded;
      clear(accentList);
      ACCENT_CHOICES.forEach(function (a) {
        var avail = a.key === 'mixed' ? n > 0 : SP.available(a.key);
        var input = h('input', { type: 'radio', name: 'accent', id: 'accent-' + a.key, value: a.key });
        input.checked = store.settings.accent === a.key;
        input.addEventListener('change', function () {
          store.settings.accent = a.key; save();
          SP.setOptions({ accent: a.key });
          paintDynamic();
        });
        accentList.appendChild(h('label', { class: 'accent', for: 'accent-' + a.key },
          input,
          h('span', { class: 'accent-main' },
            h('span', { class: 'accent-title' }, a.label, a.note ? h('span', { class: 'badge note' }, a.note) : null),
            h('span', { class: 'accent-desc' }, a.desc),
            n ? h('span', { class: 'badge ' + (avail ? 'ok' : 'no') }, avail ? 'Available on this device' : 'Not on this device: we use British or American instead') : null)));
      });

      clear(cast);
      Object.keys(C.characters).forEach(function (who) {
        if (who === 'teacher') return;
        var ch = C.characters[who];
        var name;
        if (srcRecorded && SP.hasRecorded && st.media !== 'broken') name = SP.recordedLabel(who) || 'Recorded voice';
        else {
          var v = SP.voiceFor(who);
          name = v && v.voice ? v.voice.name + ' (' + v.voice.lang + ')' : 'Default voice';
        }
        var play = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Play a sample: ' + ch.name }, icon('play'));
        play.addEventListener('click', function () { SP.say(Items.SAMPLE, who); });
        cast.appendChild(h('div', { class: 'cast-row' },
          avatarOf(who),
          h('span', { class: 'cast-main' }, h('span', { class: 'cast-name' }, ch.name), h('span', { class: 'cast-voice' }, name)),
          play));
      });
    }
    paintDynamic();
    SP.onChange(paintDynamic);
    cleanup.push(function () { SP.offChange(paintDynamic); });

    /* --- offline --- */
    if (SP.hasRecorded && navigator.serviceWorker && navigator.serviceWorker.controller) {
      var offSec = section('Use it on the plane', 'Use no avião');
      var offBtn = h('button', { class: 'btn', type: 'button' }, icon('download'), 'Save all lessons for offline use');
      var offMsg = h('p', { class: 'muted' }, '');
      offBtn.addEventListener('click', function () {
        var names = SP.packNames();
        var urls = Object.keys(IMG).map(function (k) { return IMG[k]; });
        var total = names.length + urls.length;
        var done = 0, failed = 0;
        function step(ok) {
          done++;
          if (!ok) failed++;
          offMsg.textContent = done < total ? 'Saving… ' + done + ' of ' + total
            : failed ? 'Some lessons could not be saved. Check the internet and try again.' : 'Done! All lessons, sounds and pictures work without internet now.';
          if (done === total) offBtn.disabled = false;
        }
        offBtn.disabled = true;
        offMsg.textContent = 'Saving… 0 of ' + total;
        names.forEach(function (n) { SP.loadPack(n, step); });
        urls.forEach(function (u) {
          fetch(u).then(function (r) { step(r.ok); }, function () { step(false); });
        });
      });
      add(offSec, [h('p', null, 'Download all the sounds so the lessons also work without internet, for example on the plane.'),
        pt('Baixe todos os sons para as lições funcionarem também sem internet, por exemplo no avião.'),
        h('div', { class: 'controls' }, offBtn), offMsg]);
      main.appendChild(offSec);
    }

    main.appendChild(h('section', { class: 'panel' },
      h('h2', null, 'Better device voices'),
      h('p', null, 'Only needed for “Device voices”.'),
      h('ul', { class: 'plain-list' },
        h('li', null, h('strong', null, 'iPhone / iPad: '), 'Settings → Accessibility → Spoken Content → Voices → English. Download an “Enhanced” voice, and English (India) or Arabic voices for other accents.'),
        h('li', null, h('strong', null, 'Android: '), 'Settings → search “Text-to-speech” → Google engine settings → Install voice data.'),
        h('li', null, h('strong', null, 'Computer: '), 'Microsoft Edge has very natural voices, including Indian English and Arabic.')),
      h('p', { class: 'muted small' }, 'After you install a voice, close the browser completely and open this website again.')));

    main.appendChild(h('section', { class: 'panel' },
      h('h2', null, 'Speaking practice'),
      h('p', null, SP.hasRec
        ? 'Tap “Say it” next to your sentences, then speak. The website checks your words. It needs the microphone and an internet connection.'
        : 'This browser can’t listen to your voice, so “Say it” is hidden. Chrome, Edge and Safari can do it.'),
      pt(SP.hasRec
        ? 'Toque em “Say it” ao lado das suas frases e fale. O site confere as palavras. Precisa do microfone e de internet.'
        : 'Este navegador não consegue ouvir sua voz, por isso o “Say it” fica escondido. Chrome, Edge e Safari conseguem.')));

    var reset = h('button', { class: 'btn danger', type: 'button' }, 'Reset my progress');
    var armed = false, armT = null;
    reset.addEventListener('click', function () {
      if (!armed) {
        armed = true;
        reset.textContent = 'Tap again to delete all progress';
        armT = setTimeout(function () { armed = false; reset.textContent = 'Reset my progress'; }, 4000);
        return;
      }
      clearTimeout(armT);
      store.progress = {}; store.stamps = {}; save();
      armed = false;
      reset.textContent = 'Progress deleted';
      reset.disabled = true;
    });
    cleanup.push(function () { clearTimeout(armT); });
    main.appendChild(h('section', { class: 'panel' },
      h('h2', null, 'Progress'),
      h('p', null, 'Your progress is saved in this browser only.'),
      pt('Seu progresso fica salvo apenas neste navegador.'),
      reset));

    root.appendChild(main);
    return root;
  }

  /* ================================================================ start */

  SP.init(C.characters, { accent: store.settings.accent, slow: !!store.settings.slow, source: store.settings.source || 'recorded' });
  render();

  try {
    if ('serviceWorker' in navigator && location.protocol === 'https:' && window.self === window.top) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline mode is optional */ });
    }
  } catch (e) { /* ignore */ }
})();
