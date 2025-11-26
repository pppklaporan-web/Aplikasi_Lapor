self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
        "login.html",
        "laporan.html",
        "dashboard.html",
        "style.css",
        "manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
