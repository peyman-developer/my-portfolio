const CACHE_NAME = 'peyman-ai-v1';
const assets = [
    './',
    './index.html',
    './style.css',
    './index.js',
    './manifest.json',
    './assets/logo.png',
    './assets/scraping.png',
    './assets/accounting.png',
    './assets/tasks.png',
    './assets/webdesign.png'
];

// Install Service Worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets');
            cache.addAll(assets);
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', evt => {
    console.log('Service Worker activated');
});

// Fetch events
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});
