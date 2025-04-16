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
      (async () => {
        try {
          // Try to get from network
          const networkResponse = await fetch(event.request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            // Clone the response before using it to cache
            try {
              await cache.put(event.request, networkResponse.clone());
            } catch (cacheError) {
              console.error('Failed to cache response:', cacheError);
            }
          }
          
          return networkResponse;
        } catch (networkError) {
          console.log('Network request failed, trying cache:', networkError);
          
          // If network fails, try to serve from cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cache match, return an offline error response
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
        }
      })()
    );
  } else {
    // For static assets and pages: Cache first, then network
    event.respondWith(
      (async () => {
        // Try cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, try network
        try {
          const networkResponse = await fetch(event.request);
          
          // Cache successful responses for static assets
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            try {
              // Clone response for caching
              await cache.put(event.request, networkResponse.clone());
            } catch (cacheError) {
              console.error('Failed to cache response:', cacheError);
            }
          }
          
          return networkResponse;
        } catch (networkError) {
          console.error('Network request failed for static asset:', networkError);
          // Return a default offline page or error
          return new Response('Offline - Resource not available', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      })()
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