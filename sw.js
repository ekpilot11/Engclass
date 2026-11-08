/*
 * Hello Dubai — offline support.
 * Network first: when online you always get the newest version; when offline
 * (for example on the plane) the last version you opened still works.
 */
var CACHE = 'hello-dubai-v3';
var ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/content.js',
  './js/content-flight.js',
  './js/content-airport.js',
  './js/pictograms.js',
  './js/image-items.js',
  './img/index.js',
  './js/speech-items.js',
  './audio/index.js',
  './js/speech.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined);
      });
    })
  );
});
