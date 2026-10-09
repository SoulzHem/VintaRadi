/**
 * VintaRadi Service Worker
 * Basic SW for PWA Installability and TWA Support
 */

const CACHE_NAME = 'vintaradi-v1';

// We don't necessarily need to cache everything for TWA,
// but PWA requires a fetch handler.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let cross-origin media streams bypass the worker. Some broadcasters do
  // not expose CORS headers, but the browser can still play them directly.
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).catch(() => new Response('', { status: 503 })),
  );
});
