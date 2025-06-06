
// NUCLEAR SERVICE WORKER REBUILD - Force complete cache invalidation
const CACHE_NAME = 'glee-world-nuclear-v' + Date.now();

console.log('🚨 NUCLEAR SERVICE WORKER: Starting with cache name:', CACHE_NAME);

// Assets to cache (minimal list to avoid caching issues)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install service worker with nuclear cache clearing
self.addEventListener('install', (event) => {
  console.log('🚨 NUCLEAR SW INSTALL: Force taking control immediately');
  self.skipWaiting(); // Force immediate activation
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Delete ALL existing caches first
      const deletePromises = cacheNames.map(cacheName => {
        console.log('🚨 NUCLEAR SW: Deleting cache:', cacheName);
        return caches.delete(cacheName);
      });
      
      return Promise.all(deletePromises).then(() => {
        console.log('🚨 NUCLEAR SW: All old caches deleted, creating new cache');
        return caches.open(CACHE_NAME).then(cache => {
          console.log('🚨 NUCLEAR SW: New cache opened:', CACHE_NAME);
          return cache.addAll(urlsToCache);
        });
      });
    })
  );
});

// Activate immediately and claim all clients
self.addEventListener('activate', (event) => {
  console.log('🚨 NUCLEAR SW ACTIVATE: Taking control of all clients');
  event.waitUntil(
    clients.claim().then(() => {
      console.log('🚨 NUCLEAR SW: All clients claimed');
      // Force reload all clients to ensure fresh start
      return clients.matchAll().then(clientList => {
        clientList.forEach(client => {
          console.log('🚨 NUCLEAR SW: Notifying client to reload');
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
      });
    })
  );
});

// Fetch handler with nuclear cache strategy
self.addEventListener('fetch', (event) => {
  // Don't cache anything with 'glee-tools' in the path
  if (event.request.url.includes('glee-tools') || 
      event.request.url.includes('PitchPipe') ||
      event.request.url.includes('audioUtils')) {
    console.log('🚨 NUCLEAR SW: Bypassing cache for audio/glee-tools request:', event.request.url);
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return a 404 response for deleted components
        return new Response('Component removed', { 
          status: 404, 
          statusText: 'Component removed from application' 
        });
      })
    );
    return;
  }
  
  // For all other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache only if network fails
        return caches.match(event.request);
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  console.log('🚨 NUCLEAR SW: Received message:', event.data);
  
  if (event.data && event.data.type === 'FORCE_RELOAD') {
    console.log('🚨 NUCLEAR SW: Force reload requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEARED') {
    console.log('🚨 NUCLEAR SW: Cache cleared message received');
    self.skipWaiting();
  }
});

console.log('🚨 NUCLEAR SERVICE WORKER SETUP COMPLETE');
