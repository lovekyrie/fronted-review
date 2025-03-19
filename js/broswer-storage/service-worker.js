
const CACHE_NAME = 'sw'
let preloadUrls = ['/index.css']

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){
    cache.addAll(preloadUrls)
  }))
})

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response){
    if(response) {
      return response
    }
    return  caches.open(CACHE_NAME).then(function(cache) {
      const path = event.request.url.replace(self.location.origin, '')
      return cache.add(path)
    }).catch(e => console.error(e))
  }))
})