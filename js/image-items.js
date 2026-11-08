/*
 * Hello Dubai — names of the lesson pictures.
 *
 * Shared by the browser (to find a picture) and by tools/list-images.js
 * (to know which pictures to make). img/index.js lists the pictures that exist;
 * anything missing simply shows the emoji instead.
 */
(function (root) {
  'use strict';

  function slug(s) {
    return String(s).toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  var SIZES = {
    vocab: [400, 400],
    scene: [960, 540],
    people: [256, 256]
  };

  var api = {
    slug: slug,
    SIZES: SIZES,
    vocab: function (stop, v) { return 'vocab/' + stop.id + '-' + slug(v.w); },
    scene: function (stop) { return 'scene/' + stop.id; },
    person: function (who) { return 'people/' + who; },
    kind: function (key) { return key.split('/')[0]; }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HDImageKeys = api;
})(this);
