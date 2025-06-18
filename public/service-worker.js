
// Cache name with version
const CACHE_NAME = 'glee-world-v2';

// Assets to pre-cache (static files)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png',
  '/lovable-uploads/b57ced8e-7ed7-405b-8302-41ab726303af.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Runtime caching for built JS/CSS and other same-origin assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      const fetchRequest = request.clone();

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for cache clear messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEARED') {
    console.log('Cache cleared message received');
    // Force service worker to skip waiting and activate
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
