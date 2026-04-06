const CACHE_NAME = 'rtbd-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard',
  '/dashboard.html',
  '/report',
  '/report.html',
  '/feed',
  '/feed.html',
  '/volunteer',
  '/volunteer.html',
  '/assets/js/main.js',
  '/assets/js/i18n.js',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Noto+Sans+Bengali:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => console.warn('Cache add errors ignored', err));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // API Calls: Network First, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Static & HTML: Stale-While-Revalidate (Instant load, background update)
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      const fetchPromise = fetch(event.request).then(networkRes => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkRes.clone()));
        return networkRes;
      }).catch(() => {
          // If offline and navigate, fallback to root or cached items
          if (event.request.mode === 'navigate') return caches.match('/');
      });
      return cachedRes || fetchPromise;
    })
  );
});
