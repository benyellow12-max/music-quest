const CACHE_NAME = 'music-quest-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/images/artist.png',
  '/images/album.png',
  '/images/song.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't cache JavaScript modules or firebase-related files
  if (url.pathname.endsWith('.js') || url.pathname.includes('firebase')) {
    return; // Let browser handle it normally
  }

  // Network-first for API requests
  if (url.pathname.startsWith('/artists') ||
      url.pathname.startsWith('/albums') ||
      url.pathname.startsWith('/songs') ||
      url.pathname.startsWith('/search') ||
      url.pathname.startsWith('/quests') ||
      url.pathname.startsWith('/profile') ||
      url.pathname.startsWith('/platforms') ||
      url.pathname.startsWith('/genres') ||
      url.pathname.startsWith('/developer') ||
      url.pathname.startsWith('/listen')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (but not JS files)
  if (url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.png') || 
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.json') ||
      url.pathname === '/' ||
      url.pathname === '/index.html') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});
