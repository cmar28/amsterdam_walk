// Amsterdam Walking Tour App Service Worker
// Handles caching of assets and API responses for offline use

const CACHE_NAME = 'amsterdam-tour-cache-v1';

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/service-worker.js',
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - respond with cached content when available
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle API requests and static assets differently
  const url = new URL(event.request.url);
  const isApiRequest = url.pathname.startsWith('/api/');
  
  if (isApiRequest) {
    // For API requests: Try network first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before using it to cache
          const responseToCache = response.clone();
          
          // Cache successful responses
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If no cache match, return a offline error response
            if (url.pathname.includes('/api/audio/')) {
              return new Response(JSON.stringify({ 
                error: 'Audio file not available offline' 
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              });
            } else if (url.pathname.includes('/api/images/')) {
              return new Response(JSON.stringify({ 
                error: 'Image not available offline' 
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              });
            } else {
              return new Response(JSON.stringify({ 
                error: 'Cannot connect to server, and no offline data available' 
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              });
            }
          });
        })
    );
  } else {
    // For static assets and pages: Cache first, then network
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, try network
        return fetch(event.request).then((response) => {
          // Clone response for caching
          const responseToCache = response.clone();
          
          // Cache successful responses for static assets
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          
          return response;
        });
      })
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'CACHE_CLEARED' });
        });
      });
    });
  }
});