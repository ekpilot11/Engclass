/*
 * Hello Dubai — the game layer.
 *
 * Miles (points), the daily goal, the days-in-a-row streak, levels and the review boxes.
 * All of it is plain logic on one plain object, which the app saves with the rest of the
 * progress. This file also plays the short game sounds and throws the confetti.
 *
 *   var game = HDGame.create(store.game, { save: save, goal: function () { return 100; } });
 *   game.award(10);       // miles for an answer
 *   game.touch();         // an activity was finished today (keeps the streak alive)
 *   game.view();          // everything the screens show
 *   game.note(id, ok);    // remember an answer for the daily review
 */
(function () {
  'use strict';

  var LEVELS = [
    { id: 'blue', name: 'Blue', pt: 'Azul', at: 0 },
    { id: 'silver', name: 'Silver', pt: 'Prata', at: 1000 },
    { id: 'gold', name: 'Gold', pt: 'Ouro', at: 3000 },
    { id: 'platinum', name: 'Platinum', pt: 'Platina', at: 7000 }
  ];
  // One activity gives about 100 miles (10 a right answer, 20 for finishing) and takes about 5 minutes.
  var GOALS = [100, 200, 300];
  var DEFAULT_GOAL = 100;
  var MILES = { first: 10, later: 5, finish: 20, gold: 50 };
  // Review boxes: a right answer moves an item one box up; it comes back after this many days.
  var BOX_DAYS = [0, 1, 2, 4, 8, 16];
  var KEEP_DAYS = 60;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(ms) {
    var d = new Date(ms);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function dayDate(key) {
    var p = String(key).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 12);
  }
  function addDays(key, n) {
    var d = dayDate(key);
    d.setDate(d.getDate() + n);
    return dayKey(d.getTime());
  }
  function levelOf(miles) {
    var at = 0;
    for (var i = 0; i < LEVELS.length; i++) if (miles >= LEVELS[i].at) at = i;
    var next = LEVELS[at + 1] || null;
    return { index: at, id: LEVELS[at].id, name: LEVELS[at].name, pt: LEVELS[at].pt, next: next, toNext: next ? next.at - miles : 0 };
  }

  function create(g, opts) {
    opts = opts || {};

    function tidy() {
      g.miles = Math.max(0, Math.floor(+g.miles || 0));
      if (!g.days || typeof g.days !== 'object') g.days = {};
      if (!g.streak || typeof g.streak !== 'object') g.streak = {};
      g.streak.n = Math.max(0, Math.floor(+g.streak.n || 0));
      g.streak.best = Math.max(g.streak.n, Math.floor(+g.streak.best || 0));
      g.streak.last = typeof g.streak.last === 'string' ? g.streak.last : '';
      if (!g.gold || typeof g.gold !== 'object') g.gold = {};
      if (!g.review || typeof g.review !== 'object') g.review = {};
    }
    tidy();

    function save() { if (opts.save) opts.save(); }
    function today() { return dayKey(Date.now()); }
    function goal() {
      var v = opts.goal ? +opts.goal() : DEFAULT_GOAL;
      return GOALS.indexOf(v) >= 0 ? v : DEFAULT_GOAL;
    }
    function streakNow() {
      var t = today();
      return g.streak.last === t || g.streak.last === addDays(t, -1) ? g.streak.n : 0;
    }

    /* Everything the screens need, in one object. */
    function view() {
      var t = today();
      var miles = g.days[t] || 0;
      var gl = goal();
      var week = [];
      for (var i = 6; i >= 0; i--) {
        var k = addDays(t, -i);
        var m = g.days[k] || 0;
        var letter = '';
        try { letter = dayDate(k).toLocaleDateString('en-GB', { weekday: 'narrow' }); } catch (e) { letter = ''; }
        week.push({ key: k, letter: letter, miles: m, practised: m > 0, goal: m >= gl, today: i === 0 });
      }
      return {
        total: g.miles,
        today: miles,
        goal: gl,
        pct: Math.min(1, miles / gl),
        goalDone: miles >= gl,
        level: levelOf(g.miles),
        streak: streakNow(),
        best: g.streak.best,
        practisedToday: g.streak.last === t,
        week: week
      };
    }

    /* Add miles. Tells the caller if this reached today's goal or a new level. */
    function award(n) {
      n = Math.max(0, Math.floor(+n || 0));
      if (!n) return { miles: 0, goalReached: false, levelUp: null };
      var before = view();
      var t = today();
      g.miles += n;
      g.days[t] = (g.days[t] || 0) + n;
      var keys = Object.keys(g.days).sort();
      while (keys.length > KEEP_DAYS) delete g.days[keys.shift()];
      save();
      var after = view();
      return {
        miles: n,
        goalReached: !before.goalDone && after.goalDone,
        levelUp: after.level.index > before.level.index ? after.level : null
      };
    }

    /* An activity was finished: today counts for the streak. */
    function touch() {
      var t = today();
      if (g.streak.last === t) return { n: g.streak.n, grew: false };
      g.streak.n = g.streak.last === addDays(t, -1) ? g.streak.n + 1 : 1;
      g.streak.last = t;
      g.streak.best = Math.max(g.streak.best, g.streak.n);
      save();
      return { n: g.streak.n, grew: true };
    }

    /* Daily review: remember how an item went. Wrong answers come back today. */
    function note(id, ok) {
      if (!id) return;
      var t = today();
      var r = g.review[id] || { box: 0, due: t };
      r.box = ok ? Math.min(BOX_DAYS.length - 1, (r.box || 0) + 1) : 0;
      r.due = addDays(t, BOX_DAYS[r.box]);
      g.review[id] = r;
      save();
    }
    function due(limit) {
      var t = today();
      var ids = Object.keys(g.review).filter(function (id) { return g.review[id].due <= t; });
      ids.sort(function (a, b) {
        var ra = g.review[a], rb = g.review[b];
        return ra.box - rb.box || (ra.due < rb.due ? -1 : ra.due > rb.due ? 1 : 0) || (a < b ? -1 : 1);
      });
      return limit ? ids.slice(0, limit) : ids;
    }
    function seen() { return Object.keys(g.review); }
    function drop(id) { if (g.review[id]) { delete g.review[id]; save(); } }

    function setGold(stopId) {
      if (g.gold[stopId]) return false;
      g.gold[stopId] = new Date(Date.now()).toISOString();
      save();
      return true;
    }

    function reset() {
      Object.keys(g).forEach(function (k) { delete g[k]; });
      tidy();
      save();
    }

    return {
      award: award, touch: touch, view: view, note: note, due: due, seen: seen, drop: drop,
      gold: function (stopId) { return g.gold[stopId] || null; },
      setGold: setGold, reset: reset
    };
  }

  /* ---------------------------------------------------------------- sounds */

  // One shared player: iPhones only let a player start by itself after it was started by a tap,
  // and the first game sound always comes from a tap on an answer.
  var sfxOn = true;
  var sfxPlayer = null;
  function sfx(name) {
    var data = typeof window !== 'undefined' && window.HD_SFX && window.HD_SFX[name];
    if (!sfxOn || !data || typeof Audio === 'undefined') return;
    try {
      if (!sfxPlayer) { sfxPlayer = new Audio(); sfxPlayer.preload = 'auto'; }
      sfxPlayer.src = 'data:audio/mpeg;base64,' + data;
      sfxPlayer.volume = 0.8;
      var p = sfxPlayer.play();
      if (p && p.catch) p.catch(function () { /* sound is a bonus: never an error */ });
    } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------------- confetti */

  function calm() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  var COLORS = ['#FFC21A', '#00A7B5', '#F2695C', '#3D6FD6', '#2FA866', '#FFFFFF'];
  function confetti(count) {
    if (calm() || !document.body || !document.body.animate) return;
    var layer = document.createElement('div');
    layer.className = 'confetti';
    layer.setAttribute('aria-hidden', 'true');
    var w = window.innerWidth, hgt = window.innerHeight;
    for (var i = 0; i < (count || 40); i++) {
      var piece = document.createElement('span');
      var size = 6 + Math.random() * 6;
      piece.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + size + 'px;height:' + (size * (1.2 + Math.random())) +
        'px;background:' + COLORS[i % COLORS.length] + ';';
      layer.appendChild(piece);
      var drift = (Math.random() - 0.5) * w * 0.35;
      var turn = (Math.random() - 0.5) * 1080;
      piece.animate([
        { transform: 'translate3d(0,-40px,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate3d(' + drift + 'px,' + (hgt + 60) + 'px,0) rotate(' + turn + 'deg)', opacity: 1 }
      ], { duration: 1500 + Math.random() * 1100, delay: Math.random() * 300, easing: 'cubic-bezier(.25,.5,.45,1)', fill: 'both' });
    }
    document.body.appendChild(layer);
    setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 3200);
  }

  var api = {
    LEVELS: LEVELS, GOALS: GOALS, DEFAULT_GOAL: DEFAULT_GOAL, MILES: MILES,
    create: create, sfx: sfx, confetti: confetti, calm: calm,
    setSound: function (on) { sfxOn = !!on; },
    dayKey: dayKey, addDays: addDays, levelOf: levelOf
  };
  if (typeof window !== 'undefined') window.HDGame = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
