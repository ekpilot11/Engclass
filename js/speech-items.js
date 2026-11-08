/*
 * Hello Dubai — the list of everything the app can say.
 *
 * Shared by the browser (to find the recorded MP3 for a sentence) and by
 * tools/list-speech.js (to know which sentences to record). Keep the two in sync
 * by only changing this file.
 */
(function (root) {
  'use strict';

  var TEST = 'Hello! Welcome to Dubai. I hope you enjoy your new home.';
  var SAMPLE = 'Hello! Welcome to Dubai.';

  function clean(text) {
    return String(text == null ? '' : text)
      .replace(/[\[\]]/g, '')
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s*—\s*/g, ', ')
      .replace(/[⬆⬅➡⬇]️?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // FNV-1a, 32 bit, as 8 hex characters.
  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  /* fx: '' normal, 'fast' (spoken quickly on purpose), 'quiet' (noisy airport). */
  function key(who, text, fx) { return fnv(who + '|' + (fx || '') + '|' + clean(text)); }

  function fxOf(turn) { return turn.fast ? 'fast' : turn.quiet ? 'quiet' : ''; }

  function list(C) {
    var out = [];
    var seen = {};
    function add(pack, who, text, fx) {
      if (!text) return;
      var k = key(who, text, fx);
      if (seen[pack + k]) return;
      seen[pack + k] = true;
      out.push({ pack: pack, who: who, text: clean(text), fx: fx || '', key: k });
    }
    C.journeys.forEach(function (j) {
      j.stops.forEach(function (s) {
        var p = s.id;
        add(p, 'teacher', s.intro);
        (s.vocab || []).forEach(function (v) { add(p, 'teacher', v.w); add(p, 'teacher', v.ex); });
        if (s.dialogue) {
          s.dialogue.lines.forEach(function (l) { add(p, l.who, l.say || l.t); });
          (s.dialogue.questions || []).forEach(function (q) { add(p, 'teacher', q.q); });
        }
        (s.roleplay || []).forEach(function (t) {
          if (t.who) add(p, t.who, t.say || t.t, fxOf(t));
          if (t.choose && !t.ask) t.choose.forEach(function (o) { if (o.ok) add(p, 'you', o.say || o.t); });
        });
        (s.signs || []).forEach(function (id) { add(p, 'teacher', C.signs[id].en); add(p, 'teacher', C.signs[id].mean); });
        (s.signquiz || []).forEach(function (q) {
          add(p, 'teacher', q.q);
          if (q.opts) add(p, 'teacher', C.signs[q.opts[0]].en);
        });
        (s.signorder || []).forEach(function (id) { add(p, 'teacher', C.signs[id].en); });
        (s.phrases || []).forEach(function (ph) { add('common', 'you', ph.t); });
      });
    });
    [C.essentials, C.family.items, C.emergency].forEach(function (group) {
      group.forEach(function (ph) { add('common', 'you', ph.t); });
    });
    add('common', 'teacher', TEST);
    Object.keys(C.characters).forEach(function (who) { add('common', who, SAMPLE); });
    return out;
  }

  var api = { clean: clean, key: key, fxOf: fxOf, list: list, TEST: TEST, SAMPLE: SAMPLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HDSpeechItems = api;
})(this);
