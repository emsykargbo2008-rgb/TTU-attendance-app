// Service Worker for TTU Attendance PWA
// Handles offline caching and versioned asset upgrades

const CACHE_NAME = 'ttu-attendance-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './dashboard.html',
    './students.html',
    './sessions.html',
    './attendance.html',
    './reports.html',
    './admins.html',
    './css/style.css',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './js/firebase.js',
    './js/auth.js',
    './js/students.js',
    './js/sessions.js',
    './js/attendance.js',
    './js/reports.js',
    './js/admins.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }

    const isFirebaseApi = request.url.includes('/firebase') || request.url.includes('gstatic.com');
    if (isFirebaseApi) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response && response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(request).then(response => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
                return response;
            }).catch(() => {
                if (request.destination === 'document' || request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return new Response('Offline', { status: 503, statusText: 'Offline' });
            });
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
