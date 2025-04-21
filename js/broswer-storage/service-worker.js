const CACHE_NAME = 'sw'
const preloadUrls = ['/index.css']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    cache.addAll(preloadUrls)
  }))
})

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => {
    if (response) {
      return response
    }
    return caches.open(CACHE_NAME).then((cache) => {
      const path = event.request.url.replace(self.location.origin, '')
      return cache.add(path)
    }).catch(e => console.error(e))
  }))
})
