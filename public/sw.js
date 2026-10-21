const CACHE_NAME = 'vtesitaly-__BUILD_TS__';
const MAX_CACHE_ENTRIES = 200;

const PRECACHE = [
  '/',
  '/en/',
  '/manifest.json',
  '/favicon-32.png',
  '/logo-192.png',
  '/apple-touch-icon.png',
  '/images/logo.webp',
  '/images/headers/header-home.webp',
];
const PRECACHE_PATHS = new Set(PRECACHE);

// Install: precache shell. skipWaiting + clients.claim (below) hand the open
// tabs to the new worker at once; the page then shows the "new version"
// banner (src/scripts/sw-register.ts) so a reload loads the fresh content.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

// Trim cache to MAX_CACHE_ENTRIES, evicting the oldest runtime entries first.
// The precached shell is never evicted: it is the offline fallback.
async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let excess = keys.length - max;
  for (const request of keys) {
    if (excess <= 0) break;
    if (PRECACHE_PATHS.has(new URL(request.url).pathname)) continue;
    await cache.delete(request);
    excess--;
  }
}

// Only complete, successful answers are stored: no 404/500 pages, no opaque
// or redirected responses, no 206 partial content.
function cacheable(response) {
  return response.ok && response.status === 200 && response.type === 'basic';
}

function store(request, response) {
  const clone = response.clone();
  caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, clone))
    .then(() => trimCache(CACHE_NAME, MAX_CACHE_ENTRIES))
    .catch(() => {
      /* quota exceeded or storage unavailable: serving still works */
    });
}

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (cacheable(response)) store(request, response);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return (fallback && (await caches.match(fallback))) || Response.error();
  }
}

// Fetch: network-first for pages and data, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  // Range requests (PDF viewers, media) expect 206 partial answers: let the
  // browser handle them, a cached full body would not match.
  if (request.headers.has('range')) return;

  const url = new URL(request.url);

  // Network only: pagefind (its own fetches, hashed index) and PDFs (large,
  // replaced under the same name: a cached copy would stay stale).
  if (url.pathname.startsWith('/pagefind/')) return;
  if (url.pathname.toLowerCase().endsWith('.pdf')) return;
  if (url.origin !== self.location.origin) return;

  const isPage = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');

  if (isPage) {
    // Offline fallback in the page's own language.
    const fallback = url.pathname === '/en' || url.pathname.startsWith('/en/') ? '/en/' : '/';
    event.respondWith(networkFirst(request, fallback));
  } else if (url.pathname.startsWith('/api/')) {
    // The calendar events: same address across deploys, so the network wins.
    event.respondWith(networkFirst(request));
  } else {
    // Cache-first for static assets (images, CSS, JS)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (cacheable(response)) store(request, response);
          return response;
        });
      }),
    );
  }
});
