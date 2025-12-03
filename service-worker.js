const CACHE_NAME = 'aplikasi-lapor-v1';
const ASSETS = [
  './',
  './index.html',
  './teknisi.html',
  './style.css',
  './script/dashboard.js',
  './script/teknisi.js',
  './manifest.json'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  // network-first for API requests (to always get latest)
  if (req.url.includes('/macros/') || req.url.includes('/exec')) {
    ev.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }
  // cache-first for static assets
  ev.respondWith(
    caches.match(req).then(resp => resp || fetch(req))
  );
});
