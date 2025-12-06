const CACHE_NAME = "petugas-cache-v1";
const FILES_TO_CACHE = [
  "dashboard-petugas.html",
  "assets/css/styles.css",
  "assets/js/dashboard-petugas.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
