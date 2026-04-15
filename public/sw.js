const CACHE = 'cliptok-v1'

const PRECACHE = [
  '/',
  '/login/',
  '/dashboard/',
  '/create/',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.svg',
]

// Install: cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch: network-first for API, cache-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // Never intercept API calls or cross-origin requests
  if (url.hostname !== self.location.hostname) return

  // Network-first for HTML navigations (always get fresh pages when online)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .catch(() => caches.match('/') )
    )
    return
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      })
    })
  )
})
