# Web Vitals Core Metrics

In senior frontend interviews, Web Vitals is not about reciting definitions. You need to answer three things:

1. What user-experience problem each metric reflects
2. How to collect and analyze them in production
3. How to diagnose and optimize when something goes wrong

If you only say “LCP, CLS, and INP are important,” that usually isn’t deep enough.

## 1. What problem Web Vitals solves

In traditional performance discussions, many metrics are more technical — total load time, request count, script size. What users actually feel is:

- When the main content becomes visible
- How long it takes to get feedback after an action
- Whether the page jumps around while loading

Web Vitals tries to quantify that user perception.

## 2. Core metrics

### 1. LCP

`LCP` is the time until the largest content element finishes rendering.

Common LCP elements:

- Above-the-fold hero image
- Main heading
- Above-the-fold hero block

It reflects: **how soon the user can see the page’s primary content.**

### 2. INP

`INP` is the delay from a user interaction to the next visual feedback.

It focuses on real interaction experience, not just whether a click handler fired.

It reflects: **how soon the page “responds” after the user acts.**

### 3. CLS

`CLS` is the accumulated layout shift during load and interaction.

It reflects: **whether the page is stable — does it jump.**

Typical issues:

- Images without reserved dimensions
- Ads inserted asynchronously
- Reflow after fonts load

## 3. Don’t treat Web Vitals as lab-only metrics

Lighthouse and DevTools give you lab data, but senior interviews usually follow up with:

- How do you collect real-user data in production
- How do you segment by device, page, and version
- How do you correlate with release versions

In other words, the data that actually has governance value is RUM.

## 4. How to collect

A common approach is to collect real-user data with the `web-vitals` library.

```ts
import { onLCP, onCLS, onINP } from 'web-vitals'

onLCP(metric => report(metric))
onCLS(metric => report(metric))
onINP(metric => report(metric))
```

A more complete report payload usually also includes:

- Page URL
- Route name
- Device info
- Network type
- release/version
- User or anonymous session id

Otherwise you only see a site-wide average, which is hard to use for diagnosis.

## 5. Read metrics in context

Not every page is the same.

- Content pages care more about LCP and CLS
- Interactive admin UIs care more about INP
- Users on weak networks more easily expose TTFB and resource-loading issues

A stronger interview answer is: **don’t only look at site-wide averages — break them down by page type, device, network, and version.**

## 6. How to diagnose a bad LCP

Common sources:

- TTFB is too high
- The above-the-fold image is too large
- Critical resources load late
- Above-the-fold JS blocks rendering
- CSR first paint depends on a lot of JS initialization

When diagnosing, usually check:

1. Is the server slow to respond, or is the browser slow to download
2. What exactly is the LCP element
3. When did it start requesting, and when did it render

Common optimizations:

- Optimize first-screen image size and format
- `preload` the LCP resource
- Reduce blocking scripts
- SSR / SSG, or split the critical rendering path
- More sensible cache and CDN strategy

## 7. How to diagnose a bad INP

A poor INP usually means:

- Event handlers are too heavy
- The main thread has long tasks
- One interaction triggers a large re-render
- Layout and paint cost too much

When diagnosing, often look at:

- Long tasks in the Performance panel
- Main-thread flame charts around the interaction
- Whether a large list, chart, and complex components update together

Common optimizations:

- Split long tasks
- Use a Worker
- Decouple input state from heavy recomputation
- transition / deferred value / virtual list
- Avoid unnecessary state propagation

## 8. How to diagnose a bad CLS

A poor CLS usually means the page structure is “filled in later.”

Common sources:

- Images without width/height
- Ads inserted asynchronously
- Dynamic banners inserted at the top
- Font swaps causing reflow

Common optimizations:

- Reserve space
- Use skeleton screens or placeholder containers
- Avoid inserting elements above existing content
- Set a sensible font-loading strategy

## 9. How Web Vitals ties into the monitoring system

Looking at metrics alone is not enough. A real governance loop is usually:

`collect -> aggregate -> group by version -> threshold alerts -> diagnose with errors/release records -> optimize -> verify`

For example:

- After a new release, LCP rises clearly
- At the same time, error monitoring shows more resource 404s
- You can quickly suspect the static-asset strategy or CDN config

So Web Vitals should not be an isolated module — it should be part of the observability system.

## 10. Common senior-interview follow-ups

### Q1: Why do we emphasize INP now instead of FID?

Because FID mainly looks at first-input delay and has limited coverage; INP looks at overall interaction experience and is closer to what users actually feel.

### Q2: Why isn’t LCP just “the image is slow”?

Because it can be affected by TTFB, blocking resources, JS initialization, rendering strategy, and more. The image is only the most common surface symptom.

### Q3: Why does CLS matter so much for the business?

Because layout jumps directly affect click accuracy and user trust — especially on content pages, form pages, and ad pages.

### Q4: Why can’t we only look at lab data?

Because lab data rarely covers real user devices, networks, browsers, and complex scenarios. Real release governance depends on production RUM.

## 11. How to answer in interviews

If asked about Web Vitals, don’t answer by reciting definitions. A more solid structure is:

1. First say what experience problem each of the three core metrics represents
2. Then say how you collect in production and aggregate by version
3. Then say the diagnosis path when each metric goes bad
4. Finally add one optimization case from a real project

That upgrades the answer from “knows the metric names” to “can do performance governance.”
