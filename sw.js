// Service Worker minimal untuk M_Vis PWA
// Wajib di-hosting di folder yang sama dengan file HTML (misal: /sw.js)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through sederhana, cukup untuk syarat "installable" PWA
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
