// Service Worker for PWA
// Handles offline caching and push notifications

const CACHE_NAME = 'ttu-attendance-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/dashboard.html',
    '/students.html',
    '/sessions.html',
    '/attendance.html',
    '/reports.html',
    '/admins.html',
    '/css/style.css',
    '/js/firebase.js',
    '/js/auth.js',
    '/js/students.js',
    '/js/sessions.js',
    '/js/attendance.js',
    '/js/reports.js',
    '/js/admins.js',
    '/pwa/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets...');
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.warn('Some assets failed to cache:', err);
                    // Continue without failing the installation
                    return Promise.resolve();
                });
            })
            .catch(err => {
                console.log('Cache open failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Network first strategy for API calls
    if (request.url.includes('/api/') || request.url.includes('firebase')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then(cachedResponse => {
                            return cachedResponse || new Response('Offline - data not available', {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'text/plain'
                                })
                            });
                        });
                })
        );
        return;
    }

    // Cache first strategy for assets
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page or cached response
                        return caches.match('/index.html');
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline changes
self.addEventListener('sync', event => {
    if (event.tag === 'sync-attendance') {
        event.waitUntil(syncAttendanceData());
    }
});

async function syncAttendanceData() {
    try {
        // This would sync any attendance data that was saved offline
        console.log('Syncing attendance data...');
        // In a real implementation, you would:
        // 1. Get pending changes from IndexedDB
        // 2. Send to Firebase
        // 3. Clear local pending changes
        return Promise.resolve();
    } catch (error) {
        console.error('Sync failed:', error);
        return Promise.reject(error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    if (!event.data) {
        return;
    }

    const options = {
        body: event.data.text(),
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="%231e40af"/><text x="96" y="96" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">T</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%231e40af"/></svg>',
        tag: 'ttu-attendance',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('TTU Attendance System', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(clientList => {
                // Check if TTU Attendance is already open
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not open, open the app
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});
