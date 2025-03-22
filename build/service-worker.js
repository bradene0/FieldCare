const CACHE_NAME = 'fieldcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event handler - Network first, then cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle offline data sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-visits') {
    event.waitUntil(syncVisits());
  }
});

// Background sync for offline data
async function syncVisits() {
  try {
    const db = await openDB();
    const visits = await db.getAll('visits');
    const pendingVisits = visits.filter(visit => visit.syncStatus === 'pending');

    for (const visit of pendingVisits) {
      try {
        // Attempt to sync with server
        await fetch('/api/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visit),
        });

        // Update sync status
        visit.syncStatus = 'synced';
        await db.put('visits', visit);
      } catch (error) {
        console.error('Error syncing visit:', error);
      }
    }
  } catch (error) {
    console.error('Error in sync process:', error);
  }
} 