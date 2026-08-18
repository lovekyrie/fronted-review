# Day 61 HTTP cache + Service Worker execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 61 | Cache + SW | [Caching](../network&broswer/cache-mechanism), [Browser storage](../network&broswer/broswer-storage) |

## Today's goals

- Finish MDN HTTP Caching + Service Worker API
- Draw a request chain: “browser → Service Worker → HTTP cache → network”
- Write up the three common Service Worker strategies: Cache First / Network First / Stale While Revalidate

## Reading notes

- A SW is a request proxy: it can intercept fetch and decide whether to go to the network or the Cache API
- SW update flow: install → waiting → activate; a hard refresh does not replace the old SW immediately
- `Cache-Control: no-cache` is not “do not cache”; it means “revalidate every time”. `no-store` is the one that disables caching entirely

## Cheat sheet / knowledge

### HTTP caching system

| Type | Header | Behavior |
|------|------|------|
| **Strong cache** | `Cache-Control: max-age=31536000` | No request; use the local cache directly |
| **Negotiated cache** | `ETag` / `If-None-Match` | Send a request; the server returns 304 or new content |
| | `Last-Modified` / `If-Modified-Since` | Same as above (lower precision, second-level) |

### Common Cache-Control values

| Value | Meaning |
|----|------|
| `max-age=N` | Cache is fresh for N seconds |
| `no-cache` | **Revalidate every time** (not “do not cache”!) |
| `no-store` | **Do not cache at all** |
| `immutable` | Do not revalidate within the freshness lifetime (pair with hashed filenames) |
| `s-maxage=N` | CDN cache lifetime (overrides max-age) |
| `stale-while-revalidate=N` | After expiry, return the stale cache first and update in the background |

### Best practice: split strategies for HTML vs static assets

```text
HTML:       Cache-Control: no-cache (revalidate every time so the entry is always latest)
JS/CSS/IMG: Cache-Control: max-age=31536000, immutable (long-lived cache + hashed filenames)
API:        Cache-Control: no-store or max-age=0, must-revalidate
```

### Service Worker lifecycle

```text
register → install (download and cache assets) → waiting (wait for the old SW to release) → activate (clean old caches) → fetch (intercept requests)
```

- **install**: precache static assets (`caches.open + cache.addAll`).
- **waiting**: a newly installed SW does not take over immediately; all old pages must close first. `skipWaiting()` can skip this.
- **activate**: clean caches from old versions. `clients.claim()` takes over immediately.

### Three caching strategies

| Strategy | Behavior | Fit |
|------|------|------|
| **Cache First** | Check the cache first; network only on miss | Static assets, fonts, images |
| **Network First** | Network first; fall back to cache on failure | API, HTML |
| **Stale While Revalidate** | Return the cache first, update in the background | Assets that are not critical but should eventually be consistent |

## Handwritten / flowcharts

### Request chain

```text
Browser issues a request
  → Service Worker intercepts (fetch event)
    → SW cache hit? → return cache
    → miss → send to the network
      → HTTP strong-cache hit (max-age not expired)? → return disk/memory cache
      → expired → send to the server
        → negotiated-cache hit (304)? → return local cache
        → miss → return the new resource (200)
```

### Implementing the three strategies

```js
// Cache First
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const clone = res.clone()
        caches.open('v1').then(cache => cache.put(e.request, clone))
        return res
      })
    )
  )
})

// Network First
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open('v1').then(cache => cache.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

// Stale While Revalidate
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        caches.open('v1').then(cache => cache.put(e.request, res.clone()))
        return res
      })
      return cached || fetchPromise
    })
  )
})
```

## Oral questions

### 1. How do you choose among the three common Service Worker cache strategies?

Answer template:

> Look at how “fresh” the resource must be. Static assets (JS/CSS/images) use **Cache First** — their filenames include a hash, so they do not change; a cache hit is the fastest return. APIs and HTML use **Network First** — prefer the latest data, and fall back to cache when the network is down so the app still works offline. In between (user avatars, rarely changing config) use **Stale While Revalidate** — serve the stale copy first for speed, silently refresh in the background, and the next visit is fresh.
>
> In real projects, prefer Workbox: it wraps these strategies so you configure them instead of hand-rolling them.

### 2. What is the difference between `no-cache` and `no-store`?

Answer template:

> `no-cache` does not mean “do not cache”. It means “you may cache it, but you must revalidate with the server before every use”. The browser keeps the resource, but the next request sends `If-None-Match` / `If-Modified-Since`. If the server says it has not changed, it returns 304 and the cache is used; if it has changed, it returns the new resource.
>
> `no-store` is the one that means “do not cache at all” — the browser stores no copy and re-downloads every time. Use it for sensitive data (banking pages, password-related APIs). Day to day, HTML uses `no-cache` (revalidate to stay latest); sensitive APIs use `no-store`.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Request chain (browser → SW → HTTP cache → network) + strong cache vs negotiated cache (1.5 min)
2. SW lifecycle (install → waiting → activate) + skipWaiting/claim (2 min)
3. Three cache strategies (Cache First / Network First / SWR) + when to use each (1.5 min)

After recording, self-check:

- Did you say no-cache ≠ do not cache.
- Did you mention the SW waiting phase and skipWaiting.
- Did you name the resource types each of the three strategies fits.
- Did you say HTML uses no-cache + static assets use long-lived cache + hash.

## Today's recap

The 3 points that most need review today:

1. The `stale-while-revalidate` HTTP header (same name as the SW strategy, different layer).
2. The “wait for old pages to close” problem when a SW updates (and the risk of `skipWaiting`).
3. How the Cache API relates to the browser HTTP cache (two independent cache layers).
