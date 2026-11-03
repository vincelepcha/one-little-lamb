/* One Little Lamb: offline reading after the first visit.
   Serves the saved copy straight away, and quietly refreshes it in the background. */
var CACHE = "one-little-lamb-v3";
var FILES = [
  "./",
  "index.html",
  "style.css",
  "scenes.js",
  "script.js",
  "manifest.webmanifest",
  "fonts/fraunces.woff2",
  "fonts/nunito.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      var key = req.mode === "navigate" ? "index.html" : req;
      return cache.match(key, { ignoreSearch: true }).then(function (saved) {
        var fresh = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(key, res.clone());
          return res;
        }).catch(function () { return saved; });
        if (saved) { event.waitUntil(fresh.then(function () {}, function () {})); return saved; }
        return fresh;
      });
    })
  );
});
