### Browser Caching
Browser caching includes strong cache and negotiated cache. It speeds up page loads and reduces pressure on the server.

#### 1. Strong cache
##### 1.1 Basic concepts
```http
# Strong-cache response headers
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

##### 1.2 Cache control
```http
# Disable caching entirely
Cache-Control: no-store

# Force revalidation
Cache-Control: no-cache

# Private cache
Cache-Control: private

# Public cache
Cache-Control: public

# Maximum freshness lifetime
Cache-Control: max-age=3600

# Shared-cache maximum freshness lifetime
Cache-Control: s-maxage=3600
```

#### 2. Negotiated cache
##### 2.1 Basic concepts
```http
# Request headers
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Response headers
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

##### 2.2 Validation flow
```http
# First request
GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Content-Length: 1234

# Second request
GET /index.html HTTP/1.1
Host: example.com
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

HTTP/1.1 304 Not Modified
```

#### 3. Caching flow
##### 3.1 Strong-cache flow
```plaintext
1. The browser issues a request
2. Check whether the strong cache has expired
   - Not expired: use the cache directly
   - Expired: fall through to negotiated cache
3. Return the cached content
```

##### 3.2 Negotiated-cache flow
```plaintext
1. The browser issues a request
2. Check the negotiated cache
   - Resource unchanged: return 304
   - Resource changed: return 200 and the new resource
3. Update the cache
```

#### 4. Caching strategies
##### 4.1 Static assets
```http
# HTML files
Cache-Control: no-cache

# CSS/JS files
Cache-Control: max-age=31536000

# Image files
Cache-Control: max-age=31536000
```

##### 4.2 Dynamic resources
```http
# API responses
Cache-Control: no-store

# User data
Cache-Control: private, no-cache
```

#### 5. Best practices
1. Set cache lifetimes thoughtfully
2. Use version numbers or hashes
3. Treat static and dynamic resources differently
4. Implement a cache-update mechanism
5. Handle cache invalidation
6. Account for CDN caching
7. Monitor cache hit rate
8. Tune the caching strategy
9. Handle cache conflicts
10. Implement cache warmup

#### 6. Common interview questions
1. **Strong cache vs negotiated cache**
   - How validation works
   - Response status
   - When to use each
   - Performance impact

2. **How to choose a caching strategy**
   - Resource type
   - Update frequency
   - User needs
   - Server load

3. **How to handle cache problems**
   - Cache penetration
   - Cache breakdown
   - Cache avalanche
   - Cache updates

#### 7. High-frequency add-on: easy-to-mix Cache-Control directives

- `no-store`: do not cache at all (strictest).
- `no-cache`: may cache, but must revalidate with the server before use.
- `max-age=0`: usually means “already expired, revalidate now”.
- `immutable`: the resource will not change before it expires (often used with hashed static assets).

```http
Cache-Control: public, max-age=31536000, immutable
```

#### 8. High-frequency add-on: frontend release caching strategy (strongly recommended)

1. **HTML**: `no-cache` (always get the latest entry).
2. **JS/CSS/images**: content hash in the filename + long cache (`max-age=31536000, immutable`).
3. **API data**: choose `no-store` or `private, no-cache` based on business sensitivity.

#### 9. High-frequency add-on: where the browser stores cache

- Memory Cache: fastest to read, short lifetime.
- Disk Cache: can persist across processes and restarts.
- Service Worker Cache: programmable cache, good for offline and fine-grained strategies.

> Interview tip: which cache layer the browser hits is an implementation detail. The frontend mainly influences caching behavior through response headers.

## Daily practice reference

### Day 6: Two-layer cache model

```text
Browser issues a request
  → check strong cache (Cache-Control / Expires)
    → hit: return 200 (from cache) directly, no server request
    → miss: send a negotiation-cache request (with ETag / Last-Modified)
      → server 304: not modified, use local cache
      → server 200: return the new resource
```

| Type | Fields | Priority |
|------|------|--------|
| Strong cache | `Cache-Control: max-age=xxx` | higher than `Expires` |
| Negotiation cache | `ETag` / `If-None-Match` | higher than `Last-Modified` |

**Engineering practice**: do not cache HTML (`no-cache`); strongly cache JS/CSS with a hash in the filename (versioning); long-cache images/fonts.

### Day 6: Cache decision flowchart

```text
Request a resource
  ├─ Cache-Control: max-age not expired?
  │    └─ yes → 200 (from disk/memory cache)
  │    └─ no → request the server with If-None-Match (ETag)
  │              ├─ resource unchanged → 304 Not Modified
  │              └─ resource changed → 200 + new resource
  └─ no cache headers → normal request 200
```

### Day 61: HTTP caching system

| Type | Header | Behavior |
|------|------|------|
| **Strong cache** | `Cache-Control: max-age=31536000` | No request; use the local cache directly |
| **Negotiated cache** | `ETag` / `If-None-Match` | Send a request; the server returns 304 or new content |
| | `Last-Modified` / `If-Modified-Since` | Same as above (lower precision, second-level) |

### Day 61: Common Cache-Control values

| Value | Meaning |
|----|------|
| `max-age=N` | Cache is fresh for N seconds |
| `no-cache` | **Revalidate every time** (not “do not cache”!) |
| `no-store` | **Do not cache at all** |
| `immutable` | Do not revalidate within the freshness lifetime (pair with hashed filenames) |
| `s-maxage=N` | CDN cache lifetime (overrides max-age) |
| `stale-while-revalidate=N` | After expiry, return the stale cache first and update in the background |

### Day 61: Best practice: split strategies for HTML vs static assets

```text
HTML:       Cache-Control: no-cache (revalidate every time so the entry is always latest)
JS/CSS/IMG: Cache-Control: max-age=31536000, immutable (long-lived cache + hashed filenames)
API:        Cache-Control: no-store or max-age=0, must-revalidate
```

### Day 61: Service Worker lifecycle

```text
register → install (download and cache assets) → waiting (wait for the old SW to release) → activate (clean old caches) → fetch (intercept requests)
```

- **install**: precache static assets (`caches.open + cache.addAll`).
- **waiting**: a newly installed SW does not take over immediately; all old pages must close first. `skipWaiting()` can skip this.
- **activate**: clean caches from old versions. `clients.claim()` takes over immediately.

### Day 61: Three caching strategies

| Strategy | Behavior | Fit |
|------|------|------|
| **Cache First** | Check the cache first; network only on miss | Static assets, fonts, images |
| **Network First** | Network first; fall back to cache on failure | API, HTML |
| **Stale While Revalidate** | Return the cache first, update in the background | Assets that are not critical but should eventually be consistent |

### Day 61: Request chain

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

### Day 61: Implementing the three strategies

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
