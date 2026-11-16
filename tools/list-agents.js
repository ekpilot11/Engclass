#!/usr/bin/env node
/*
 * Prints the live conversations of the lessons (the "freeTalk" of each stop), as JSON,
 * for tools/make_agents.py.
 * Usage: node tools/list-agents.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ['js/content.js', 'js/content-flight.js', 'js/content-airport.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
}
const C = sandbox.window.HD_CONTENT;
const out = [];
C.journeys.forEach(j => j.stops.forEach(stop => {
  if (!stop.freeTalk) return;
  const who = stop.freeTalk.who;
  out.push({
    stop: stop.id,
    lesson: stop.title,
    who: who,
    name: (C.characters[who] || {}).name || who,
    talk: stop.freeTalk
  });
}));
process.stdout.write(JSON.stringify(out, null, 1));
