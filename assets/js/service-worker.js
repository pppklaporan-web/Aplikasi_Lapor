/* service-worker.js — caching sederhana untuk PWA */
const CACHE = 'lapor-v1';
const ASSETS = [
'index.html','dashboard.html','petugas.html','styles.css',
'index.js','dashboard.js','petugas.js','manifest.json'
];

self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())
);
});

self.addEventListener('activate', (e) => {
e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
const req = e.request;
// network-first for API calls to GAS
if (req.url.includes('script.google.com/macros')) {
e.respondWith(
fetch(req).catch(()=>caches.match('/offline.html'))
);
return;
}
// cache-first for static
e.respondWith(
caches.match(req).then(r => r || fetch(req))
);
});
