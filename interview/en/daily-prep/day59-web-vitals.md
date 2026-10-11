# Day 59 Web Vitals Metrics

## Goals

- Finish the three web.dev articles on Web Vitals / LCP / INP / CLS
- Output a mapping table from the three metrics to optimization actions
- Measure a page's LCP / INP / CLS in the Chrome DevTools Performance panel

## Read in order

1. [Web Vitals](../network&broswer/web-vitals)
2. [Performance Optimization](../advanced/week6/performance-optimization)

## Practice and self-check

**Checkpoints**

- LCP cares about **the paint time of the largest visible element**, not when the whole page has finished loading
- INP replaced FID; it measures the slowest response across the whole interaction session
- CLS only counts unexpected layout shifts (those with an input do not count)

**Produce or redraw from memory**

- Three core metrics — [reference section](../network&broswer/web-vitals#day-59-three-core-metrics)
- LCP optimization — [reference section](../advanced/week6/performance-optimization#day-59-lcp-optimization)
- INP optimization — [reference section](../advanced/week6/performance-optimization#day-59-inp-optimization)
- CLS optimization — [reference section](../advanced/week6/performance-optimization#day-59-cls-optimization)
- Measurement approaches — [reference section](../network&broswer/web-vitals#day-59-measurement-approaches)
- LCP diagnosis tree — [reference section](../network&broswer/web-vitals#day-59-lcp-diagnosis-tree)
- web-vitals instrumentation — [reference section](../network&broswer/web-vitals#day-59-web-vitals-instrumentation)

**Answer aloud without reading a reference answer**

- 1. Typical optimization actions for the three metrics?
- 2. What was LCP on your last project, and how did you optimize it?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Definitions + thresholds of the three metrics (LCP ≤2.5s / INP ≤200ms / CLS ≤0.1) (1.5 minutes)
2. Full LCP optimization chain (image/CSS/TTFB) (2 minutes)
3. INP + CLS optimization + web-vitals instrumentation (1.5 minutes)

Self-check after recording:

- Did you state the thresholds of the three metrics.
- Did you state that LCP is usually an image or large text.
- Did you state that INP replaced FID.
- Did you state that CLS only counts unexpected shifts.

## Recap

The 3 points that most need follow-up today:

1. The effect of the `fetchpriority` attribute on resource-load priority.
2. The difference between INP and FID (FID only measures the first interaction; INP measures the slowest among all interactions).
3. Using the `PerformanceObserver` API (custom metric collection).
