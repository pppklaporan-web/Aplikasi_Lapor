const CACHE_NAME = "dashboard-petugas-v1";
const urlsToCache = [
  "/dashboard-petugas.html",
  "/assets/css/styles-dashboard.css",
  "/assets/js/dashboard-petugas.js",
  "/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
