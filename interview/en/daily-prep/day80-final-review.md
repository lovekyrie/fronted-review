# Day 80 final gap-fill + 80-day recap — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 80 | Final recap | [Senior frontend index](../advanced/senior-frontend-index), [Week 8 roadmap](../advanced/week8/roadmap), [Week 8 question bank](../advanced/week8/question-bank) |

## Today's goals

- Merge every Day 1–79 “N-question answer book” into one *Senior frontend 100-question ultimate answer book*
- Produce an *80-day recap*: solid / needs another pass / do not touch
- Lock the next 2 weeks of high-frequency questions (top 30)

## Reading checkpoints

- Endgame is not new knowledge — only **speaking fluency** and **gap-fill**
- Every topic needs a 1-minute, 3-minute, and 5-minute version
- Rank the final list by **ask probability × mastery gap**

## Cheat sheet / knowledge

### 100-question answer book (by topic)

```text
JS basics (15): closures / prototype / this / event loop / Promise / async / coercion / ...
Vue (15): reactivity / diff / component comms / keep-alive / SSR / Pinia / Router / ...
React (12): Fiber / hooks / concurrent / state batching / memo / RSC / ...
TypeScript (10): generics / conditionals / mapped / template literals / utility types / ...
Engineering (12): Vite / Webpack / Babel / ESLint / CI/CD / monorepo / ...
Perf (10): Web Vitals / first paint / cache / lazy load / ...
Security (5): XSS / CSRF / CSP / CORS / ...
Testing (8): layering / Vitest / VTU / Playwright / Mock / ...
Scenarios (8): large-file upload / virtual list / permission / micro-frontends / monitoring / ...
Soft skills (5): STAR / self-intro / why you left / architecture design / ...
```

### Three answer lengths

| Length | Time | Structure |
|----|------|------|
| **1-minute** | Concept + core conclusion | "XX is YY; the core is ZZ" |
| **3-minute** | 1-minute + internals + code/example | Add a layer of why + how |
| **5-minute** | 3-minute + comparison + production + traps | Add landing and follow-up plan |

### High-frequency 30 (by ask probability)

```text
1.  What is a closure? Where is it used?
2.  Event loop / macro vs micro output question
3.  Promise chaining + async/await output question
4.  Vue 3 reactivity (Proxy + track/trigger)
5.  Vue 3 diff (longest increasing subsequence)
6.  Vue component communication
7.  Why React hooks cannot be called conditionally
8.  useEffect traps (stale closure / cleanup)
9.  useMemo vs useCallback vs React.memo
10. React concurrent mode (time slicing / Suspense)
11. TypeScript generic constraints
12. TS conditional types + infer
13. Why Vite is fast / vs Webpack
14. Tree Shaking internals
15. HTTP cache (strong / negotiation)
16. Cross-origin solutions
17. First-paint optimization (LCP)
18. Three core Web Vitals
19. XSS and CSRF defense
20. Frontend test layering
21. Large-file upload design
22. Virtual list implementation
23. Frontend permission design
24. Micro-frontend options
25. Frontend error monitoring
26. CSS BFC / centering
27. Handwrite Promise.all
28. Handwrite debounce / throttle
29. Handwrite deep clone
30. Project STAR (what you did + numbers)
```

## Handwritten / flow

### Battle map: status lights per topic

```text
🟢 Solid (confident + 2 follow-up layers):
  JS basics / closures / prototype / event loop / Promise
  Vue reactivity / diff / component comms / Pinia / Router
  Vite internals / Tree Shaking / Code Split
  HTTP cache / CORS
  Handwritten P0 (Promise.all / debounce / deep clone / EventEmitter)

🟡 Needs another pass (can answer, stall on follow-up):
  React concurrent / RSC / Fiber details
  Advanced TS (template literals / complex mapped types)
  Micro-frontend sandbox details / MF config
  Mapping metrics to quantified optimizations
  Playwright E2E advanced usage

🔴 Deliberately skip (do not expand in interviews):
  WebAssembly details
  Flutter / Dart language details
  Backend database tuning
  Contest algorithms (medium+ DP / graphs)
```

### Last-week sprint

```text
Day -7: 1-minute versions of the high-frequency 30
Day -6: 3-minute versions of the high-frequency 30
Day -5: Yellow-light topics
Day -4: Timed handwritten (5 min each)
Day -3: Mock 1 (pure tech)
Day -2: Mock 2 (mixed round)
Day -1: Rest + 1-minute versions + resume check
```

## Spoken questions

### Final self-check 10 (roadmap acceptance)

**1. Why is Vite usually faster than webpack in development / why not in production?**

> Vite uses native ESM in dev; the browser requests modules on demand, no bundle. Startup is just the dev server; business code is not pre-bundled. HMR updates only the changed module. Production uses Rollup — HTTP/2 + ESM with many tiny files loses to a merged bundle, and you still need Tree Shaking and minify.

**2. How should production cache and versioning be designed?**

> Do not cache HTML (`no-cache`); every request gets the latest. JS/CSS/images use content hash in the filename (`app.a1b2c3.js`) with `Cache-Control: max-age=31536000` for a year of strong cache. A release only changes hashes; old files expire on their own. CDN adds `s-maxage`.

**3. Why did Vue 3 reactivity pick Proxy?**

> Object.defineProperty cannot intercept new properties or array index assignment. Proxy intercepts at the object level: add/delete, array changes, Map/Set. Less code, better perf (no recursive define). Cost: no IE.

**4. Why does Vue 3 diff use LIS?**

> Goal: minimize DOM moves. Find the longest subset whose relative order is unchanged (LIS); those nodes stay. Only move nodes not in the LIS. Time O(n log n).

**5. Why do React effects cause common traps?**

> The effect callback runs async after paint and closes over that render’s state snapshot. If the dependency array misses a value, the callback sees a stale one (stale closure). Fix: complete deps, keep the latest value in a ref, or functional updates.

**6. React concurrent is not multithreading — where is the “concurrency”?**

> Interruptible render. React splits render into Fiber units; after each unit it checks for higher-priority work. If so, it pauses and handles the urgent update first. Macroscopically it looks like several updates at once; microscopically it is single-thread time slicing.

**7. How do advanced TypeScript types serve real component design?**

> Generics let props infer (e.g. `Select<T>`); conditionals narrow API return types; mapped types keep form fields in sync with validators. Goal: full inference and autocomplete for callers, fewer runtime errors.

**8. How do frontend metrics map to concrete optimizations?**

> LCP → largest first-paint content → critical resources (preload hero, Code Split, SSR). INP → interaction delay → less main-thread blocking (Web Worker, split long tasks). CLS → layout shift → width/height on images, reserved ad slots.

**9. Why is high coverage not high quality?**

> Coverage only measures “did this code run”, not “is the assertion meaningful”. 100% line coverage can be all happy path — no error branches, no edges. Effective tests = the right matrix (happy + error + edge) + meaningful assertions.

**10. What is the full path of a real project from local to production?**

> Local (Vite dev + HMR) → PR → CI (lint + type check + unit + E2E) → Code Review → merge → build (Vite build) → staging → staging verify (E2E smoke) → canary → full release → production monitoring (web-vitals + error reporting + alerts).

## 10-minute recording order (final run-through)

1. Vue: reactivity + diff + component comms + keep-alive (2 min)
2. React: hooks rules + concurrent + useEffect traps (1.5 min)
3. Engineering + deploy: Vite + Tree Shaking + CI/CD + cache strategy (2 min)
4. Perf + security + monitoring: Web Vitals + first paint + XSS/CSRF + error reporting (2 min)
5. Testing + TypeScript: layering + Vitest + generics + conditionals (1.5 min)
6. Project story: 1-minute STAR + “what was hardest” (1 min)

## 80-day recap

Solid (green):

- Full JS basics (closures / prototype / event loop / Promise / this)
- Vue 3 full path (reactivity / diff / components / Router / Pinia / SSR)
- Engineering core (Vite / Tree Shaking / Code Split / CI/CD)
- HTTP cache + CORS + security (XSS / CSRF / CSP)
- Handwritten P0
- Project STAR delivery

Needs another pass (yellow):

- React concurrent details (Fiber scheduling, Lane model)
- Hard TS type gymnastics (4+ nested conditionals)
- Micro-frontend sandbox internals
- Playwright advanced (network mock / visual regression)
- Quantified perf stories (need more believable numbers)

Deliberately skip (red; do not expand in interviews):

- WebAssembly / Rust in WASM
- Flutter / Dart
- Backend database tuning / K8s ops
- Hard algorithms (DP / graphs)

High-frequency list for the next 2 weeks (the 30):

- See “High-frequency 30” above. Each day: 10 questions, 1-minute → 3-minute → 5-minute.
