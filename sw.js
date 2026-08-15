// sw.js - Service Worker minimal untuk M_Vis
// Taruh file ini di folder yang SAMA dengan file HTML M_Vis saat hosting,
// supaya fitur "Add to Home Screen" (PWA) bisa aktif dan tidak muncul
// warning 404 di console.

const CACHE_NAME = 'mvis-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Strategi network-first sederhana: coba ambil dari internet dulu,
// kalau gagal (offline) baru pakai salinan dari cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone).catch(() => {});
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
