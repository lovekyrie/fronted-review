# Day 60 First-Paint Performance Optimization Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 60 | First-paint optimization | [Performance Optimization](../advanced/week6/performance-optimization), [Web Vitals](../network&broswer/web-vitals) |

## Today's Goals

- Finish web.dev Optimize LCP
- Output a first-paint optimization checklist: network layer / resource layer / rendering layer / runtime
- Draw an SPA first-paint waterfall and mark stages that can be optimized

## Reading Checkpoints

- Critical first-paint resources: HTML → critical CSS → critical JS → first-paint data → first-paint images
- Fetch APIs earlier: `<link rel="preconnect">` + `<link rel="preload">` + SSR/skeleton screens
- Business-layer optimizations: merge APIs, slim fields, fetch on demand, image formats (WebP / AVIF)

## Cheat Sheet / Knowledge Points

### 4 layers of first-paint optimization

| Layer | Optimization direction | Key measures |
|----|----------|----------|
| **Network layer** | Fewer requests + faster transfer | HTTP/2 / CDN / gzip / Brotli / domain consolidation |
| **Resource layer** | Smaller size + load first | Tree Shaking / Code Splitting / preload / WebP |
| **Rendering layer** | Less blocking + show sooner | SSR / skeleton screens / inline critical CSS / defer JS |
| **Runtime** | Less main-thread blocking | Virtual lists / Web Worker / lazy loading / load on demand |

### Critical rendering path

```text
HTML → discover CSS → block rendering → CSSOM ready
HTML → discover JS → block parsing (without async/defer) → JS executes
             ↓
       Both ready → Render Tree → Layout → Paint → first paint visible
```

Key: **CSS blocks rendering; JS blocks parsing**.

### preload / preconnect / prefetch

| Directive | Role | Timing | Fit for |
|------|------|------|------|
| `preload` | Load resources required by the **current page** early | Immediately on the current page | Critical fonts, LCP images, critical JS |
| `preconnect` | Establish TCP + TLS connections early | Current page | API domains, CDN domains |
| `prefetch` | Preload **next-page** resources when idle | Low priority | JS chunks of the next-page route |
| `dns-prefetch` | DNS lookup only | Current page | Third-party domains |

### SSR vs skeleton screen vs Loading

| Approach | First-paint speed | Implementation cost | SEO | Fit for |
|------|----------|----------|-----|------|
| SSR | Fastest | High | ✅ | Content pages |
| Skeleton screen | Medium | Low | ❌ | SPA |
| Loading spinner | Slowest perceived | Lowest | ❌ | Back office |

## Handwritten / Flowcharts

### SPA first-paint waterfall + optimization points

```text
Time →
├── DNS + TCP + TLS ──────── [preconnect can save this]
├── HTML download ──────────── [SSR emits content directly]
├── CSS download + parse ────── [inline critical CSS / preload]
├── JS download ────────────── [Code Split / defer / preload]
├── JS execute ────────────── [Tree Shaking to shrink size]
├── API request ──────────── [merge APIs / preconnect / server prefetch]
├── Data render ──────────── [skeleton placeholder / virtual list]
└── Image load ──────────── [WebP / lazy loading / fetchpriority]
```

### Critical-resource loading example

```html
<!-- Preconnect the API domain -->
<link rel="preconnect" href="https://api.example.com" />

<!-- Preload the critical font -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload the LCP image -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- Prefetch the next page -->
<link rel="prefetch" href="/about.chunk.js" />

<!-- Defer non-critical JS -->
<script src="/analytics.js" defer></script>
```

## Oral Questions

### 1. How do you optimize an SPA white screen?

Answer template:

> The root cause of an SPA white screen is: after the browser downloads HTML, it still has to download JS, execute JS, request APIs, and render the DOM before any content is visible. Optimize from four layers:
>
> Network layer: CDN + HTTP/2 + Brotli compression. Resource layer: Code Splitting (split by route) + Tree Shaking to shrink the bundle. Rendering layer: inline critical CSS (avoid CSS blocking first paint), skeleton screens (there is already content before JS runs), SSR (the server emits HTML directly). Runtime: image lazy loading, lazy-load non-first-paint components.
>
> The most effective single measure is SSR / skeleton screens — let users see content before JS finishes.

### 2. Differences among `preload` / `preconnect` / `prefetch`?

Answer template:

> The three have different purposes. `preload` tells the browser "the current page needs this resource right away, load it early"; it is high priority and fits critical fonts and LCP images. `preconnect` does not download a resource; it only establishes the connection early (DNS + TCP + TLS), saving connection time, and fits API domains and CDNs. `prefetch` is "preload resources the next page may use when idle"; it is the lowest priority and will not affect current-page loading.
>
> In practice: LCP image → preload, API domain → preconnect, next-page route chunk → prefetch.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. 4-layer first-paint optimization framework (network/resource/rendering/runtime) (2 minutes)
2. Critical rendering path + differences among preload/preconnect/prefetch (1.5 minutes)
3. SSR vs skeleton screens + business-side rollout (merge APIs/image optimization) (1.5 minutes)

Self-check after recording:

- Did you state that CSS blocks rendering and JS blocks parsing.
- Did you state the fit of preload / preconnect / prefetch respectively.
- Did you state Code Splitting by route.
- Did you state the role of skeleton screens (there is already content before JS runs).

## Today's Review

The 3 points that most need follow-up today:

1. The difference between `modulepreload` and `preload` (modulepreload pre-parses ES Modules).
2. Tools that auto-extract Critical CSS (such as critters).
3. Slimming APIs: GraphQL / a BFF layer fetching fields on demand to reduce first-paint payload.
