/* ============================================================
   SALEH GAMING — service-worker.js
   PWA offline caching with network-first strategy
   ============================================================ */

const CACHE_NAME = 'saleh-gaming-v2';
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache (original 10 + new 10 games)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  // ── Original 10 games ──────────────────────────────────────
  '/games/snake.html',
  '/games/2048.html',
  '/games/tictactoe.html',
  '/games/memory.html',
  '/games/space-shooter.html',
  '/games/flappy.html',
  '/games/racing.html',
  '/games/zombie.html',
  '/games/chess.html',
  '/games/bubble.html',
  // ── New 10 games ───────────────────────────────────────────
  '/games/super-platformer.html',
  '/games/zombie-survival.html',
  '/games/street-racing.html',
  '/games/shadow-fighter.html',
  '/games/tower-defense.html',
  '/games/galaxy-attack.html',
  '/games/football-stars.html',
  '/games/dungeon-quest.html',
  '/games/jewel-match.html',
  '/games/basketball-challenge.html',
  // ── PWA icons & character assets ───────────────────────────
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/favicon.png',
  '/assets/images/super-hero.png',
  '/assets/images/super-hero-data.js'
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => cache.addAll(['/index.html', '/style.css', '/script.js', '/offline.html']));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first, fallback to cache, then offline page
self.addEventListener('fetch', (event) => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
