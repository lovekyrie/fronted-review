# Day 60 First-Paint Performance Optimization

## Goals

- Finish web.dev Optimize LCP
- Output a first-paint optimization checklist: network layer / resource layer / rendering layer / runtime
- Draw an SPA first-paint waterfall and mark stages that can be optimized

## Read in order

1. [Performance Optimization](../advanced/week6/performance-optimization)
2. [Web Vitals](../network&broswer/web-vitals)

## Practice and self-check

**Checkpoints**

- Critical first-paint resources: HTML → critical CSS → critical JS → first-paint data → first-paint images
- Fetch APIs earlier: `<link rel="preconnect">` + `<link rel="preload">` + SSR/skeleton screens
- Business-layer optimizations: merge APIs, slim fields, fetch on demand, image formats (WebP / AVIF)

**Produce or redraw from memory**

- 4 layers of first-paint optimization — [reference section](../advanced/week6/performance-optimization#day-60-4-layers-of-first-paint-optimization)
- Critical rendering path — [reference section](../advanced/week6/performance-optimization#day-60-critical-rendering-path)
- preload / preconnect / prefetch — [reference section](../advanced/week6/performance-optimization#day-60-preload-preconnect-prefetch)
- SSR vs skeleton screen vs Loading — [reference section](../advanced/week6/performance-optimization#day-60-ssr-vs-skeleton-screen-vs-loading)
- SPA first-paint waterfall + optimization points — [reference section](../advanced/week6/performance-optimization#day-60-spa-first-paint-waterfall-optimization-points)
- Critical-resource loading example — [reference section](../advanced/week6/performance-optimization#day-60-critical-resource-loading-example)

**Answer aloud without reading a reference answer**

- 1. How do you optimize an SPA white screen?
- 2. Differences among `preload` / `preconnect` / `prefetch`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. 4-layer first-paint optimization framework (network/resource/rendering/runtime) (2 minutes)
2. Critical rendering path + differences among preload/preconnect/prefetch (1.5 minutes)
3. SSR vs skeleton screens + business-side rollout (merge APIs/image optimization) (1.5 minutes)

Self-check after recording:

- Did you state that CSS blocks rendering and JS blocks parsing.
- Did you state the fit of preload / preconnect / prefetch respectively.
- Did you state Code Splitting by route.
- Did you state the role of skeleton screens (there is already content before JS runs).

## Recap

The 3 points that most need follow-up today:

1. The difference between `modulepreload` and `preload` (modulepreload pre-parses ES Modules).
2. Tools that auto-extract Critical CSS (such as critters).
3. Slimming APIs: GraphQL / a BFF layer fetching fields on demand to reduce first-paint payload.
