const CACHE_NAME = 'rtbd-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/js/main.js',
  '/assets/js/i18n.js',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Noto+Sans+Bengali:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/'));
    })
  );
});
