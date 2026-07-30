export function serveServiceWorker(): Response {
  const sw = `
const CACHE_NAME = 'snarelink-v1';
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
  // Network-first: always try live data, fall back to cache only if offline.
  // Never cache API calls — dashboard data must always be fresh.
  if (event.request.url.includes('/api/')) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
`;
  return new Response(sw, { headers: { 'content-type': 'application/javascript' } });
}
