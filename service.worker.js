self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("lapor-cache-v1").then(c=>{
      return c.addAll([
        "/",
        "/index.html",
        "/dashboard.html",
        "/dashboard_public.html",
        "/laporan.html",
        "/style.css",
        "/nama.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res=>res || fetch(e.request))
  );
});
