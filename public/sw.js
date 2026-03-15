const CACHE_NAME = 'vtesitaly-v3';

const PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon-32.png',
  '/logo-192.png',
  '/apple-touch-icon.png',
  '/images/logo.webp',
  '/images/headers/header-home.webp',
  '/404.html',
];

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for pages, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip pagefind and external requests
  if (url.pathname.startsWith('/pagefind/')) return;
  if (url.origin !== self.location.origin) return;

  const isPage = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');

  if (isPage) {
    // Network-first for HTML pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/404.html') || caches.match('/')))
    );
  } else {
    // Cache-first for static assets (images, CSS, JS)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
