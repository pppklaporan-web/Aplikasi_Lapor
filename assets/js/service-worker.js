/* service-worker.js (root) — simple cache strategy for PWA */
const CACHE_NAME = 'petugas-cache-v1';
const FILES_TO_CACHE = [
'dashboard-petugas.html',
'assets/css/dashboard-petugas.css',
'assets/js/dashboard-petugas.js',
'manifest.json',
'icons/icon-192.png',
'icons/icon-512.png'
];

self.addEventListener('install', (evt) => {
evt.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(FILES_TO_CACHE);
})
);
self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
evt.respondWith(
caches.match(evt.request).then((resp) => {
return resp || fetch(evt.request);
})
);
});
