// Version-specific cache; no forced activation during an active count.
const CACHE = 'cash-counter-2-5';
const ASSETS = [
  './', './index.html', './styles.css', './app.js',
  './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'
];
const SCOPE = new URL(self.registration.scope);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(path =>
      new Request(new URL(path, SCOPE), { cache: 'reload' })
    )))
  );
  // Deliberately no skipWaiting here. The user chooses when to update.
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('cash-counter-') && key !== CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try { return await fetch(request); }
    catch (error) {
      if (request.mode === 'navigate') {
        const offlinePage = await cache.match(new URL('./index.html', SCOPE));
        if (offlinePage) return offlinePage;
      }
      throw error;
    }
  })());
});
