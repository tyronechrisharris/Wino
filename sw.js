const CACHE_NAME = 'wine-cellar-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './config.js',
  './manifest.json',
  // We can't cache CDN resources reliably with 'no-cors' opaque responses for everything without complicating things,
  // but for a simple PWA, we attempt to cache what we can or rely on browser cache for CDNs if online.
  // For a true offline experience, we would need to download these libs or use a more complex strategy.
  // However, the app requires Google Sheets API to work, so 'offline' functionality is limited to viewing cached data if we implement local storage syncing.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
