// public/sw-custom.js
// This extends the default Workbox service worker

// Custom handler for Cloudinary images - cache them on demand
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache Cloudinary images and placeholder images
  if (url.hostname.includes('res.cloudinary.com') || url.pathname.includes('/placeholder.png')) {
    event.respondWith(
      caches.open('shabrat-images').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // If offline and cached, return cached
            return cachedResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

// Optional: notify client when offline
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});