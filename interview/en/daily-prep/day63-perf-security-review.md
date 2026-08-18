# Day 63 Performance & security follow-up recap execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 63 | Perf + security recap | [Week 6 roadmap](../advanced/week6/roadmap), [Performance](../advanced/week6/performance-optimization), [Security](../advanced/week6/security) |

## Today's goals

- Roll up Day 57–62 into a *Performance + Security 20-question answer book*
- Produce a “performance troubleshooting checklist”: from user report to root cause
- Record an 8-minute clip: Web Vitals metrics → optimization actions → a real case

## Reading notes

- Perf questions easily get pulled into **practice**: which page you actually sped up, and how you measured it
- Security questions easily get pulled into **boundaries**: what the frontend can stop vs what the backend must stop
- In interviews, the structure for “a performance optimization you did” is: **metric → cause → solution → payoff**

## Cheat sheet / knowledge

### Performance troubleshooting checklist

```text
1. User report / monitoring alert
   → Confirm the metric: LCP / INP / CLS / TTFB? Which one is bad?
2. Locate the stage
   → Chrome Performance recording → flame chart → find long tasks
   → Network waterfall → find slow requests / large assets
   → Run Lighthouse → read the suggestions
3. Attribute
   → Network? Assets? Rendering? Runtime?
4. Plan
   → Pick optimizations for that layer (network/assets/render/runtime)
5. Verify
   → A/B test / before-after → quantify the gain with metrics
```

### Security checklist

```text
□ XSS: do not render user input with innerHTML + CSP + HttpOnly
□ CSRF: SameSite=Lax + CSRF Token + do not use GET for sensitive actions
□ Injection: parameterized queries / ORM (backend)
□ CORS: allowlist Access-Control-Allow-Origin
□ Dependencies: npm audit / Snyk scan of third-party deps
□ HTTPS: site-wide HTTPS + HSTS
□ Sensitive data: do not store tokens in localStorage (use HttpOnly cookies)
```

### Interview answer structure: metric → cause → solution → payoff

```text
"We improved homepage LCP from 4.2s to 2.1s"
  Metric: LCP P75 = 4.2s (CrUX data)
  Cause: LCP element was a first-screen hero image without preload; JS bundle 280KB blocked rendering
  Solution: 1) image preload + WebP  2) route-based code split  3) inline critical CSS
  Payoff: LCP P75 down to 2.1s, conversion +8%
```

## Handwritten / flowcharts

### Performance troubleshooting flow

```text
User reports "the page is slow"
  ├─ Slow first screen?
  │   ├─ Lighthouse LCP → > 2.5s
  │   │   ├─ High TTFB? → server / CDN
  │   │   ├─ Large assets? → compress / code split / image optimization
  │   │   └─ Render-blocking? → inline critical CSS / JS defer
  │   └─ Check CLS → > 0.1 → images without dimensions / font swap jump
  ├─ Janky interaction?
  │   ├─ Performance recording → find long tasks (> 50ms)
  │   │   ├─ Heavy JS compute? → Web Worker / split the work
  │   │   └─ Lots of DOM work? → virtual list / batch updates
  │   └─ INP > 200ms → optimize the event handler
  └─ Slow overall?
      └─ Network → waterfall → merge / parallelize / cache APIs
```

### Performance optimization STAR template

```text
Situation: ecommerce homepage LCP P75 = 4.2s, high bounce rate
Task:      get it under 2.5s
Action:
  1. Locate the bottleneck with Lighthouse + CrUX → first-screen image not preloaded + JS 280KB
  2. Images: preload + WebP + CDN + srcset
  3. JS: route-based code split; first-screen chunk 280KB → 90KB
  4. CSS: inline Critical CSS; load non-critical CSS async
  5. API: preconnect the origin + server prefetch of first-screen APIs (SSR)
Result:    LCP P75 down to 2.1s, bounce -15%, conversion +8%
```

## Oral questions

### 1. A performance optimization you led

Answer template (STAR):

> **Situation**: Our ecommerce homepage LCP P75 was around 4.2 seconds. Users said it opened slowly, and bounce rate was high.
>
> **Task**: I owned getting LCP under 2.5 seconds.
>
> **Action**: First I used Lighthouse and CrUX to locate the bottleneck. Two main causes: the first-screen image had no preload and was PNG, and a 280KB JS bundle blocked rendering. Second I did three things: switch the image to WebP + add preload + fetchpriority="high"; route-based code splitting, first-screen chunk 280KB → 90KB; inline critical CSS and load the rest async. Third I added preconnect for the API origin.
>
> **Result**: LCP P75 dropped to 2.1 seconds, bounce rate dropped 15%, and we kept watching with web-vitals RUM after launch.

### 2. 3 self-drawn follow-ups

**Q: If LCP is still not green after the optimization, what next?**

> Consider SSR / streaming so HTML ships content directly and skips the JS-execution stage. Or use Edge rendering to push server work closer to the user and cut TTFB.

**Q: How do you keep performance from regressing after launch?**

> Three levers. Integrate Lighthouse CI so every PR is scored automatically and a drop cannot merge. Keep watching with web-vitals RUM in production and set alert thresholds. Run Bundle Analyzer regularly so dependency size does not creep up quietly.

**Q: Do frontend security and performance conflict?**

> Sometimes. Strict CSP forbids inline scripts, but inlining critical CSS/JS is a perf technique — you need nonce/hash to make both work. SRI also guarantees third-party script integrity, but if the CDN updates the file and the hash no longer matches, the load fails. You have to balance security and performance.

## 8-minute recording order (performance + security topic)

1. One event-loop frame + the 5-step render pipeline (2 min)
2. The three Web Vitals + thresholds + optimization actions (1.5 min)
3. Four layers of first-screen optimization + HTTP cache + SW strategies (2 min)
4. Quick pass over XSS / CSRF / CSP (1.5 min)
5. STAR real optimization case (1 min)

## Today's recap

The 3 questions most likely to trip you up:

1. “What were the concrete numbers for a perf optimization you did?” — you must have metric numbers (LCP from X to Y).
2. “Difference between no-cache and no-store? How do you pick among the three SW strategies?” — cache details are easy to mix up.
3. “How far can the frontend go on XSS? Can it stop stored XSS?” — you need a clear frontend/backend boundary.

3 new “why” questions from this week:

1. Why does CSS block rendering but not DOM parsing? (Rendering needs the CSSOM, but the DOM can keep being built)
2. Why is SameSite=Lax the default instead of Strict? (Strict is too strict: even normal navigations omit the cookie, which hurts UX)
3. Why cannot a Service Worker take over the page immediately? (To avoid bugs from mixing old and new version code)
