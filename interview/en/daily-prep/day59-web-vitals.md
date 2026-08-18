# Day 59 Web Vitals Metrics Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 59 | Web Vitals | [Web Vitals](../network&broswer/web-vitals), [Performance Optimization](../advanced/week6/performance-optimization) |

## Today's Goals

- Finish the three web.dev articles on Web Vitals / LCP / INP / CLS
- Output a mapping table from the three metrics to optimization actions
- Measure a page's LCP / INP / CLS in the Chrome DevTools Performance panel

## Reading Checkpoints

- LCP cares about **the paint time of the largest visible element**, not when the whole page has finished loading
- INP replaced FID; it measures the slowest response across the whole interaction session
- CLS only counts unexpected layout shifts (those with an input do not count)

## Cheat Sheet / Knowledge Points

### Three core metrics

| Metric | Full name | Measures | Good | Needs Improvement | Poor |
|------|------|------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | Paint time of the largest visible element | ≤ 2.5s | ≤ 4s | > 4s |
| **INP** | Interaction to Next Paint | Response delay of the slowest interaction | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | Cumulative layout-shift amount | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### LCP optimization

LCP elements are usually: `<img>` / `<video>` / background images / large text blocks.

| Optimization direction | Measures |
|----------|------|
| Reduce resource load time | `<link rel="preload">` for the critical image / use a CDN / WebP/AVIF formats |
| Reduce render blocking | Inline critical CSS / `async` / `defer` non-critical JS |
| Reduce server time | SSR / Edge rendering / TTFB optimization |
| Priority | `fetchpriority="high"` on the LCP image |

### INP optimization

| Problem | Measures |
|------|------|
| Long tasks blocking the main thread | Split tasks (`yield to main thread`) / Web Worker |
| Slow event handling | Reduce handler complexity / debounce / use `startTransition` |
| Lots of DOM work | Virtual lists / `content-visibility` |

### CLS optimization

| Problem | Measures |
|------|------|
| Images without dimensions | Always set `width / height` or `aspect-ratio` |
| Font-swap jump | `font-display: optional` or `size-adjust` |
| Dynamically injected content | Reserve space / `min-height` / skeleton screens |

### Measurement approaches

| Tool | Type | Scenario |
|------|------|------|
| Lighthouse | Lab data | Development |
| CrUX | Real-user data | Production monitoring |
| `web-vitals` library | RUM | Custom instrumentation |
| Performance Observer | Browser API | Fine-grained measurement |

## Handwritten / Flowcharts

### LCP diagnosis tree

```text
LCP > 2.5s
  ├─ Is the LCP element an image?
  │   ├─ Image too large? → compress / WebP / AVIF / srcset
  │   ├─ Loaded too late? → preload / fetchpriority="high"
  │   └─ CDN slow? → nearby nodes / HTTP/2
  ├─ Is the LCP element text?
  │   ├─ CSS blocking? → inline critical CSS
  │   └─ Fonts loading slowly? → font-display: swap / preload fonts
  └─ TTFB slow?
      └─ Server optimization / SSR / Edge cache
```

### web-vitals instrumentation

```js
import { onLCP, onINP, onCLS } from 'web-vitals'

onLCP(metric => sendToAnalytics('LCP', metric))
onINP(metric => sendToAnalytics('INP', metric))
onCLS(metric => sendToAnalytics('CLS', metric))
```

## Oral Questions

### 1. Typical optimization actions for the three metrics?

Answer template:

> The core of LCP optimization is painting the largest element as soon as possible: preload the critical image, inline critical CSS, use WebP to shrink image size, and SSR to reduce TTFB. The core of INP optimization is keeping the main thread idle: split long tasks (yield the main thread with `scheduler.yield()` or `setTimeout`), reduce event-handler complexity, and use virtual lists to reduce DOM work. The core of CLS optimization is avoiding unexpected layout shifts: always set width/height on images, use `font-display: optional` for fonts, and reserve space for dynamic content.
>
> In a real project, first use Lighthouse to locate the worst metric, then optimize specifically. 80% of LCP problems come from image loading.

### 2. What was LCP on your last project, and how did you optimize it?

Answer template:

> (Adjust to the actual project) Our project's initial LCP was around 4s; the main bottlenecks were the first-screen large image and JS bundle blocking. Optimizations: first, add `<link rel="preload">` for the LCP image, dropping from 4s to 3s. Second, inline critical CSS + defer non-critical JS, dropping another 0.3s. Third, switch images to WebP + a CDN, finally stabilizing around 2.2s.
>
> For monitoring we used the `web-vitals` library for RUM instrumentation, sent to a self-built APM platform, and tracked P75.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Definitions + thresholds of the three metrics (LCP ≤2.5s / INP ≤200ms / CLS ≤0.1) (1.5 minutes)
2. Full LCP optimization chain (image/CSS/TTFB) (2 minutes)
3. INP + CLS optimization + web-vitals instrumentation (1.5 minutes)

Self-check after recording:

- Did you state the thresholds of the three metrics.
- Did you state that LCP is usually an image or large text.
- Did you state that INP replaced FID.
- Did you state that CLS only counts unexpected shifts.

## Today's Review

The 3 points that most need follow-up today:

1. The effect of the `fetchpriority` attribute on resource-load priority.
2. The difference between INP and FID (FID only measures the first interaction; INP measures the slowest among all interactions).
3. Using the `PerformanceObserver` API (custom metric collection).
