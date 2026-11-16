/*
 * Hello Dubai — the animated scene.
 *
 * Shows a lesson picture like a little film: the camera moves to the person who speaks or is
 * talked about, the words light up while they are spoken, the speaker's portrait moves with the
 * voice, and a small word card appears when a word of the lesson is said.
 *
 *   var stage = HDStage.create({ src, alt, spots, person, vocab, ptOn, onCard, onPlay });
 *   parent.appendChild(stage.el);
 *   stage.show(line, { hidden, pt, times });   // a new line: camera, speaker and caption
 *   stage.tick(ms);                            // while its recording plays (HDSpeech gives the time)
 *   stage.rest();                              // the line is over
 *
 * It only needs the picture and the lesson content. Without word times (device voices) the whole
 * line lights up at once. With "reduce motion" switched on in the phone, moves become cuts.
 */
(function () {
  'use strict';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function strip(t) { return String(t).replace(/[\[\]]/g, ''); }
  function norm(w) { return String(w).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ''); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

  /*
   * opts:
   *   src, alt      the scene picture
   *   spots         { name: [x, y, zoom] } places in the picture (x, y from 0 to 1)
   *   person(who)   -> { name, src, emoji } for the speaker's portrait
   *   vocab         [{ w, pt, src, emoji }] words that get a card when they are spoken
   *   ptOn          show Portuguese lines at all
   *   onCard(word)  she tapped a word card
   *   onPlay()      she tapped the picture (only for scenes that play by themselves)
   */
  function create(opts) {
    var spots = opts.spots || {};
    var root = el('div', 'sv');
    var frame = el('div', 'sv-frame');
    var drift = el('div', 'sv-drift');
    var img = el('img', 'sv-img');
    if (opts.src) img.src = opts.src;
    else frame.hidden = true;            // no picture: only the speaker's line is shown
    img.alt = opts.alt || '';
    img.decoding = 'async';
    img.draggable = false;
    drift.appendChild(img);
    frame.appendChild(drift);

    var light = el('div', 'sv-light');   // dims everything except the person or thing a line points at
    frame.appendChild(light);

    var note = el('div', 'sv-note');
    note.hidden = true;
    frame.appendChild(note);

    var card = el('button', 'sv-card');
    card.type = 'button';
    card.hidden = true;
    frame.appendChild(card);

    var playBtn = null;
    if (opts.onPlay) {
      playBtn = el('button', 'sv-play');
      playBtn.type = 'button';
      playBtn.setAttribute('aria-label', 'Play the scene');
      playBtn.innerHTML = PLAY;
      frame.appendChild(playBtn);
      frame.classList.add('can-play');
      frame.addEventListener('click', function (e) {
        if (card.contains(e.target)) return;
        opts.onPlay();
      });
    }

    var bar = el('div', 'sv-bar');
    var face = el('span', 'sv-face');
    face.setAttribute('aria-hidden', 'true');
    var textBox = el('div', 'sv-text');
    var nameEl = el('p', 'sv-name');
    var wordsEl = el('p', 'sv-words');
    var ptEl = el('p', 'sv-pt');
    ptEl.lang = 'pt-BR';
    ptEl.hidden = true;
    textBox.appendChild(nameEl);
    textBox.appendChild(wordsEl);
    textBox.appendChild(ptEl);
    bar.appendChild(face);
    bar.appendChild(textBox);
    root.appendChild(frame);
    root.appendChild(bar);

    var cur = null;          // the line on screen: { spans, starts, end, env, step, hits, shown }
    var cardTimer = null;
    var cardWord = null;

    /* ---------- camera ----------
     * A place is [x, y, zoom, light, frameX, frameY]:
     *   x, y            where the person or thing is in the picture (0 to 1)
     *   zoom            how close the camera goes
     *   light           optional: a spotlight of this size (part of the picture's height) around x, y,
     *                   for lines that point at somebody ("Who is this lady?")
     *   frameX, frameY  optional: the middle of the shot, when it should not be x, y itself
     */
    function focus(name) {
      var s = spots[name];
      if (!s) { wide(); return; }
      var z = Math.max(1, s[2] || 1);
      var cx = s[4] != null ? s[4] : s[0];
      var cy = s[5] != null ? s[5] : s[1];
      var tx = clamp(50 - cx * 100 * z, (1 - z) * 100, 0);
      var ty = clamp(50 - cy * 100 * z, (1 - z) * 100, 0);
      img.style.transform = 'translate(' + tx.toFixed(2) + '%,' + ty.toFixed(2) + '%) scale(' + z + ')';
      root.setAttribute('data-cam', name);
      if (s[3]) {
        // where x, y ends up inside the frame, and a circle there (the frame is 16:9, so as an ellipse in %)
        var px = s[0] * 100 * z + tx, py = s[1] * 100 * z + ty;
        var ry = s[3] * z * 100, rx = ry * 9 / 16;
        light.style.background = 'radial-gradient(ellipse ' + rx.toFixed(1) + '% ' + ry.toFixed(1) + '% at ' +
          px.toFixed(1) + '% ' + py.toFixed(1) + '%, transparent 68%, rgb(8 12 16 / 0.62) 100%)';
        light.classList.add('on');
      } else {
        light.classList.remove('on');
      }
    }
    function wide() {
      img.style.transform = 'translate(0,0) scale(1)';
      root.setAttribute('data-cam', 'wide');
      light.classList.remove('on');
    }

    /* ---------- speaker ---------- */
    function setFace(who) {
      var p = (opts.person && who && opts.person(who)) || null;
      face.textContent = '';
      face.className = 'sv-face' + (p ? '' : ' none');
      bar.className = 'sv-bar' + (who === 'you' ? ' you' : '');
      nameEl.textContent = p ? p.name : '';
      if (!p) return;
      if (p.src) {
        var i = el('img');
        i.src = p.src;
        i.alt = '';
        i.onerror = function () { face.textContent = p.emoji || ''; };
        face.appendChild(i);
      } else {
        face.textContent = p.emoji || '';
      }
    }

    /* ---------- word cards ---------- */
    var vocab = (opts.vocab || []).map(function (v) {
      return { v: v, toks: String(v.w).split(/\s+/).map(norm).filter(Boolean) };
    }).filter(function (x) { return x.toks.length; });
    function sameWord(a, b) { return a === b || a === b + 's' || a === b + 'es'; }
    // word position -> the lesson word that starts there
    function findHits(tokens) {
      var hits = {};
      for (var i = 0; i < tokens.length; i++) {
        for (var k = 0; k < vocab.length; k++) {
          var t = vocab[k].toks, ok = true;
          for (var j = 0; j < t.length && ok; j++) {
            if (j === t.length - 1 ? !sameWord(tokens[i + j] || '', t[j]) : tokens[i + j] !== t[j]) ok = false;
          }
          if (ok) { hits[i] = vocab[k].v; break; }
        }
      }
      return hits;
    }
    function showCard(v) {
      if (cardWord === v) return;
      cardWord = v;
      clearTimeout(cardTimer);
      card.textContent = '';
      if (v.src) {
        var i = el('img');
        i.src = v.src;
        i.alt = '';
        card.appendChild(i);
      } else if (v.emoji) {
        card.appendChild(el('span', 'sv-card-emoji', v.emoji));
      }
      var txt = el('span', 'sv-card-text');
      txt.appendChild(el('strong', null, v.w));
      if (opts.ptOn && v.pt) { var p = el('span', null, v.pt); p.lang = 'pt-BR'; txt.appendChild(p); }
      card.appendChild(txt);
      card.setAttribute('aria-label', 'Word: ' + v.w);
      card.hidden = false;
      card.classList.remove('in');
      void card.offsetWidth;
      card.classList.add('in');
    }
    function hideCard(delay) {
      clearTimeout(cardTimer);
      cardTimer = setTimeout(function () { card.hidden = true; cardWord = null; }, delay || 0);
    }
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      if (cardWord && opts.onCard) opts.onCard(cardWord);
    });

    /* ---------- caption ---------- */
    /* A new line. o: { hidden: blur the words, pt: show the Portuguese, times: from HDSpeech.timesFor, cam } */
    function show(line, o) {
      o = o || {};
      hideCard(0);
      setFace(line.who);
      focus(o.cam || line.cam || line.who);
      var words = strip(line.t).split(/\s+/).filter(Boolean);
      wordsEl.textContent = '';
      wordsEl.className = 'sv-words' + (o.hidden ? ' blurred' : '');
      var spans = words.map(function (w, i) {
        var s = el('span', 'sv-w', w);
        wordsEl.appendChild(s);
        if (i < words.length - 1) wordsEl.appendChild(document.createTextNode(' '));
        return s;
      });
      ptEl.textContent = (opts.ptOn && line.pt) || '';
      ptEl.hidden = !(o.pt && ptEl.textContent);
      var t = o.times || null;
      var starts = null;
      if (t && t.words && t.words.length) {
        // normally one time for each word; if the spoken text differs from the written one, share them out
        starts = spans.map(function (s, i) {
          var k = t.words.length === spans.length ? i : Math.min(t.words.length - 1, Math.floor(i * t.words.length / spans.length));
          return t.words[k][0];
        });
      }
      cur = {
        spans: spans, starts: starts, env: (t && t.env) || '', step: (t && t.step) || 50,
        hits: o.hidden ? {} : findHits(words.map(norm)), at: -1, live: false
      };
      root.classList.remove('speaking', 'whole', 'lit');
    }
    /* The sound of the line starts. Without word times the whole line lights up.
       quiet: the caller moves the portrait itself with level() (a live voice), so no pulsing by itself. */
    function start(quiet) {
      if (!cur) return;
      cur.live = true;
      root.classList.add('speaking');
      if (!cur.starts) {
        root.classList.add(quiet ? 'lit' : 'whole');
        for (var k in cur.hits) { if (Object.prototype.hasOwnProperty.call(cur.hits, k)) { showCard(cur.hits[k]); break; } }
      }
    }
    /* How loud a live voice is right now (0 to 1): moves the speaker's portrait. */
    function level(v) {
      face.style.setProperty('--v', clamp(+v || 0, 0, 1).toFixed(2));
    }
    function tick(ms) {
      if (!cur || !cur.starts) return;
      if (!cur.live) start();
      var i = -1;
      for (var k = 0; k < cur.starts.length; k++) { if (cur.starts[k] <= ms + 40) i = k; else break; }
      if (i !== cur.at) {
        for (var n = 0; n < cur.spans.length; n++) {
          cur.spans[n].className = 'sv-w' + (n < i ? ' said' : n === i ? ' now' : '');
        }
        for (var h = cur.at + 1; h <= i; h++) { if (cur.hits[h]) showCard(cur.hits[h]); }
        cur.at = i;
      }
      if (cur.env) {
        var d = cur.env.charCodeAt(Math.floor(ms / cur.step)) - 48;
        face.style.setProperty('--v', (d >= 0 && d <= 9 ? d / 9 : 0).toFixed(2));
      }
    }
    /* The line is over: everything was said. */
    function rest() {
      root.classList.remove('speaking', 'whole', 'lit');
      face.style.setProperty('--v', '0');
      if (cur) {
        cur.live = false;
        cur.spans.forEach(function (s) { s.className = 'sv-w said'; });
      }
      if (cardWord) hideCard(1600);
    }
    /* A caption that is not a spoken line (for example "Your turn"). */
    function say(title, text, ptText, who) {
      hideCard(0);
      cur = null;
      root.classList.remove('speaking', 'whole', 'lit');
      setFace(who || null);
      if (title) nameEl.textContent = title;
      wordsEl.className = 'sv-words plain';
      wordsEl.textContent = text || '';
      ptEl.textContent = (opts.ptOn && ptText) || '';
      ptEl.hidden = !ptEl.textContent;
    }
    function setHidden(v) { wordsEl.classList.toggle('blurred', !!v); if (cur && v) cur.hits = {}; }
    function setPt(v) { ptEl.hidden = !(v && ptEl.textContent); }
    function setNote(label, text, ptText) {
      note.textContent = '';
      if (!text) { note.hidden = true; return; }
      note.appendChild(el('span', 'sv-note-label', label || 'Situation'));
      note.appendChild(el('span', null, text));
      if (opts.ptOn && ptText) { var p = el('span', 'sv-note-pt', ptText); p.lang = 'pt-BR'; note.appendChild(p); }
      note.hidden = false;
    }
    function setPlaying(v) {
      root.classList.toggle('playing', !!v);
      if (playBtn) playBtn.setAttribute('aria-label', v ? 'Stop the scene' : 'Play the scene');
    }
    function destroy() {
      clearTimeout(cardTimer);
      cur = null;
    }

    wide();
    return {
      el: root, show: show, start: start, tick: tick, rest: rest, say: say, level: level,
      focus: focus, wide: wide, has: function (name) { return !!spots[name]; },
      setHidden: setHidden, setPt: setPt, setNote: setNote, setPlaying: setPlaying, destroy: destroy
    };
  }

  window.HDStage = { create: create };
})();
