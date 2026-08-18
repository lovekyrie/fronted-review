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
