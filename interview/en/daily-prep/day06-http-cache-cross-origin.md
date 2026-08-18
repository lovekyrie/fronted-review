# Day 6 HTTP / Caching / Cross-Origin / Storage Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 6 | HTTP / caching / cross-origin / storage | [HTTP Protocol](../network&broswer/http-protocol), [Caching](../network&broswer/cache-mechanism), [Cross-Origin](../network&broswer/cross-origin), [Browser Storage](../network&broswer/broswer-storage) |

## Today's goals

- Finish `/en/network&broswer/http-protocol`, `/en/cache-mechanism`, `/en/cross-origin`, `/en/broswer-storage`
- Produce a short flowchart of “from entering a URL to displaying the page”
- Produce one page of a *Caching Answer Template* (strong cache / negotiation cache / asset versioning)

## Reading checkpoints

- HTTP/1.1 head-of-line blocking, HTTP/2 multiplexing, and HTTP/3 QUIC solve problems at different layers
- For strong cache, `Cache-Control` outranks `Expires`; for negotiation cache, `ETag` outranks `Last-Modified`
- CORS preflight triggers: non-simple method / custom headers / non-simple Content-Type

## Cheat sheet / knowledge points

### HTTP version differences

| Version | Core traits | Problem it solves |
|------|----------|------------|
| HTTP/1.1 | persistent connections, pipelining | fewer TCP handshakes, but still HOL blocking |
| HTTP/2 | multiplexing, header compression (HPACK), server push | application-layer HOL blocking |
| HTTP/3 | QUIC (UDP-based), 0-RTT connections | transport-layer HOL blocking |

### Common status codes

- **200**: success. **204**: success with no content. **206**: range request.
- **301**: permanent redirect. **302**: temporary redirect. **304**: not modified (negotiation cache hit).
- **400**: bad request. **401**: unauthenticated. **403**: forbidden. **404**: not found.
- **500**: internal server error. **502**: bad gateway. **504**: gateway timeout.

### Two-layer cache model

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

### CORS

**Simple requests** (no preflight):
- Methods: GET / HEAD / POST
- Content-Type: `text/plain` / `multipart/form-data` / `application/x-www-form-urlencoded`
- No custom headers

**Preflight (OPTIONS)** triggers: non-simple methods (PUT / DELETE), custom headers, `Content-Type: application/json`.

Key server response headers:

```text
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### Browser storage comparison

| Dimension | Cookie | localStorage | sessionStorage | IndexedDB |
|------|--------|-------------|----------------|-----------|
| Size | ~4KB | ~5MB | ~5MB | no hard cap |
| Lifetime | can expire | persistent | session | persistent |
| Sent with requests | yes | no | no | no |
| Fit for | identity/tracking | user prefs | temporary state | large structured data |

Cookie security: `HttpOnly` (no JS read), `Secure` (HTTPS only), `SameSite` (Lax / Strict / None+Secure).

## Handwritten notes / flowcharts

### From entering a URL to displaying the page

```text
1. User enters a URL
2. DNS lookup (browser cache → OS cache → hosts → recursive query)
3. TCP three-way handshake + TLS handshake (HTTPS)
4. Send the HTTP request
5. Server handles it and returns a response
6. Browser parses HTML → build DOM Tree
7. Parse CSS → build CSSOM
8. DOM + CSSOM → Render Tree
9. Layout (compute geometry)
10. Paint (draw pixels)
11. Composite (composite layers, display the page)
```

### Cache decision flowchart

```text
Request a resource
  ├─ Cache-Control: max-age not expired?
  │    └─ yes → 200 (from disk/memory cache)
  │    └─ no → request the server with If-None-Match (ETag)
  │              ├─ resource unchanged → 304 Not Modified
  │              └─ resource changed → 200 + new resource
  └─ no cache headers → normal request 200
```

## Oral questions

### 1. How do you combine strong cache and negotiation cache?

Answer template:

> Caching has two layers. The first is strong cache, controlled by `Cache-Control: max-age`. Within the TTL the browser uses the local cache directly and does not hit the server — best performance. `Expires` can also do strong cache but has lower priority than `Cache-Control`, and it depends on client time.
>
> The second is negotiation cache, triggered after strong cache expires. The browser sends `If-None-Match` (for ETag) or `If-Modified-Since` (for Last-Modified). If the resource is unchanged, the server returns 304 and the browser keeps using the local cache. ETag outranks Last-Modified because a content hash is more precise.
>
> In practice, set the HTML entry to `no-cache` (negotiate every time), use strong cache for JS/CSS with a content hash in the filename (when content changes, the hash and URL change, bypassing the old cache), and long-cache images and fonts.

### 2. When does a preflight request fire?

Answer template:

> CORS splits requests into simple and non-simple. A simple request only needs the server to return `Access-Control-Allow-Origin`. A non-simple request first sends an OPTIONS preflight.
>
> Preflight triggers in three cases: the method is not GET / HEAD / POST; there is a custom request header (for example `Authorization`, `X-Token`); or Content-Type is not `text/plain`, `multipart/form-data`, or `application/x-www-form-urlencoded` — most commonly `application/json`.
>
> The preflight response needs `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, and so on. You can set `Access-Control-Max-Age` to cache the preflight and avoid sending OPTIONS every time.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. HTTP version differences (1.1 HOL blocking → 2 multiplexing → 3 QUIC) (1.5 minutes)
2. Two-layer cache model + versioning strategy (2 minutes)
3. CORS simple vs preflight + trigger conditions (1.5 minutes)

Self-check after recording:

- Did you say the priority relationship between strong cache and negotiation cache?
- Did you say ETag outranks Last-Modified?
- Did you say the 3 preflight trigger conditions?
- Did you say the HTML no-cache + JS/CSS hash engineering practice?

## Today's review

The 3 points that most need follow-up today:

1. How HTTP/2 multiplexing is implemented (frames, streams, the binary framing layer).
2. The three `SameSite` values and their impact on third-party cookies.
3. The interaction order between Service Worker and HTTP cache.
