#!/usr/bin/env node
/*
 * Prints every sentence the app can say, as JSON, for tools/make_audio.py.
 * Usage: node tools/list-speech.js > /tmp/speech.json
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
const items = require(path.join(root, 'js/speech-items.js')).list(sandbox.window.HD_CONTENT);
process.stdout.write(JSON.stringify(items, null, 1));
