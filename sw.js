const CACHE = 'lapor-cache-v1';
const FILES = [
  '/', '/Aplikasi_Lapor/laporan.html', '/Aplikasi_Lapor/teknisi.html', '/Aplikasi_Lapor/dashboard.html',
  '/Aplikasi_Lapor/style.css', '/Aplikasi_Lapor/manifest.json'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{ self.clients.claim(); });
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});
