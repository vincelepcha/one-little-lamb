/* One Little Lamb: offline reading after the first visit.
   When online, always fetches the newest copy (so updates show straight away) and saves it.
   When offline, or if the network is very slow, reads from the saved copy. */
var CACHE = "one-little-lamb-v7";
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
    caches.open(CACHE).then(function (cache) {
      // "reload" skips the browser's own short-term cache, so the saved copy is truly the newest.
      return Promise.all(FILES.map(function (f) {
        return fetch(new Request(f, { cache: "reload" })).then(function (res) {
          if (res.ok) return cache.put(f, res);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
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
  var key = req.mode === "navigate" ? "index.html" : req;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      // (A page request can't be re-sent with new options, so fetch its address afresh.)
      var network = fetch(req.url, { cache: "no-cache", credentials: "same-origin" }).then(function (res) {
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      });
      var saved = function () {
        return cache.match(key, { ignoreSearch: true }).then(function (r) { return r || network; });
      };
      // Newest copy first; fall back to the saved one if offline or after 4 seconds of waiting.
      var timeout = new Promise(function (resolve) { setTimeout(resolve, 4000); }).then(saved);
      return Promise.race([network.catch(saved), timeout]);
    })
  );
});
