#!/usr/bin/env node
/*
 * Prints the pictures to make, as JSON, for tools/make_images.py.
 *
 *   node tools/list-images.js --stops passport --people you,officer > /tmp/images.json
 *   node tools/list-images.js > /tmp/images.json            (every stop and every person)
 *
 * The family "character sheet" is always first: the other pictures use it as a
 * reference, so the family looks the same everywhere.
 *
 * Content fields used (all optional):
 *   stop.imgScene      what the lesson picture shows (default: the lesson intro)
 *   vocab.img          what the word card shows (default: built from the word and example)
 *   vocab.imgFamily    true when the card shows family members (uses the character sheet)
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
const Keys = require(path.join(root, 'js/image-items.js'));
const S = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-style.json'), 'utf8'));
const T = S.templates;

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1].split(',').map(s => s.trim()).filter(Boolean) : null;
}
const onlyStops = arg('stops');
const onlyPeople = arg('people');

function fill(template, subject) {
  return template.replace('{style}', S.style).replace('{subject}', subject);
}

const fam = S.family;
const jobs = [{
  key: 'sheet', kind: 'sheet', size: '1536x1024', refs: [],
  prompt: fill(T.sheet, ['(1) ' + fam.you, '(2) ' + fam.boy, '(3) ' + fam.girl, '(4) ' + fam.grandma, '(5) ' + fam.nanny].join('; ') + '.')
}];

Object.keys(S.people).forEach(who => {
  if (onlyPeople && onlyPeople.indexOf(who) < 0) return;
  // Most portraits use the family sheet as a style reference; people listed in peopleNoRef don't,
  // because the model then copies the family's faces.
  const noRef = (S.peopleNoRef || []).indexOf(who) >= 0;
  jobs.push({ key: Keys.person(who), kind: 'people', size: '1024x1024', refs: noRef ? [] : ['sheet'],
    prompt: fill(noRef ? T.personNoRef : T.person, S.people[who]) });
});

C.journeys.forEach(j => j.stops.forEach(stop => {
  if (onlyStops && onlyStops.indexOf(stop.id) < 0) return;
  jobs.push({ key: Keys.scene(stop), kind: 'scene', size: '1536x1024', refs: ['sheet'], prompt: fill(T.scene, stop.imgScene || stop.intro) });
  (stop.vocab || []).forEach(v => {
    const family = !!v.imgFamily;
    jobs.push({
      key: Keys.vocab(stop, v), kind: 'vocab', size: '1024x1024', refs: family ? ['sheet'] : [],
      prompt: fill(T.vocab, v.img || ('the meaning of the English word "' + v.w + '", as in the sentence "' + v.ex + '" (show it as a picture only)')) +
        (family ? ' The people must look exactly like the matching characters in the reference image.' : '')
    });
  });
}));

process.stdout.write(JSON.stringify(jobs, null, 1));
