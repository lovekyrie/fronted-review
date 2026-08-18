# 50 high-frequency questions (1-minute templates)

How to use: three beats — **definition / principle → scene → pitfall / trade-off**. 40–70 seconds.

## A. JS basics (1–10)

### 1. JS types? How do you check them?
- Template: primitives vs references; `typeof` for a first pass, `Object.prototype.toString.call` when you need accuracy.
- Scene: `null` vs array vs object → `toString`.
- Pitfall: `typeof null === 'object'`.

### 2. `this` binding rules?
- Template: default, implicit, explicit, `new`. Priority: `new` > explicit > implicit > default.
- Scene: lost `this` in a callback → arrow function or `bind`.
- Pitfall: arrows have no own `this`.

### 3. What does `new` do?
- Template: create object, link prototype, run constructor, return the object.
- Scene: handwritten `new` proves the depth.
- Pitfall: an explicit object return from the constructor overrides the default.

### 4. Prototype chain?
- Template: objects link via `[[Prototype]]`; lookup walks up.
- Scene: shared methods on the prototype save memory.
- Pitfall: a long chain hurts lookup and maintainability.

### 5. Closure — pros and cons?
- Template: a function that retains an outer scope; good for encapsulation and lasting state.
- Scene: debounce / throttle, private vars.
- Pitfall: holding a large object too long can leak.

### 6. Deep vs shallow copy?
- Template: shallow copies the first layer of refs; deep copies every layer.
- Scene: state management — don’t mutate the original.
- Pitfall: `JSON.parse(JSON.stringify())` drops functions, `undefined`, `Date`.

### 7. `let` / `const` / `var`?
- Template: `let/const` are block-scoped with a TDZ; `var` is function-scoped and hoisted.
- Scene: default `const`; `let` only if you reassign.
- Pitfall: `const` freezes the binding, not the object contents.

### 8. Arrow vs normal functions?
- Template: arrows are short and inherit outer `this`; no `new`, no `arguments`.
- Scene: timer callbacks so `this` doesn’t vanish.
- Pitfall: don’t blindly use arrows as object methods.

### 9. Debounce vs throttle?
- Template: debounce runs after the last trigger; throttle runs on a fixed interval.
- Scene: search input → debounce; scroll → throttle.
- Pitfall: leading vs trailing fire.

### 10. Event delegation?
- Template: bubble child events to one parent listener.
- Scene: clicks on a dynamic list.
- Pitfall: `closest` to find the real item.

## B. Async and event loop (11–16)

### 11. Event Loop?
- Template: JS is single-threaded; when the stack is empty, the engine pulls from the task queues.
- Scene: `setTimeout` vs `Promise.then` order.
- Pitfall: microtasks before the next macrotask.

### 12. Macro vs micro?
- Template: macro: `setTimeout`, I/O; micro: `Promise.then`, `MutationObserver`.
- Scene: too many microtasks starve the UI.
- Pitfall: a tight microtask chain can block paint.

### 13. Promise state and chaining?
- Template: `pending → fulfilled/rejected` is one-way; `then` returns a new Promise.
- Scene: serial async and unified errors.
- Pitfall: missing `return` breaks the chain.

### 14. `async/await` under the hood?
- Template: `async` returns a Promise; `await` is sugar that reads like sync.
- Scene: readability + `try/catch`.
- Pitfall: serial `await` can be slow — `Promise.all` for parallel.

### 15. `Promise.all` vs `allSettled`?
- Template: `all` fails if one fails; `allSettled` collects every result.
- Scene: hard deps → `all`; tolerant fan-in → `allSettled`.
- Pitfall: when `all` rejects, the other requests may already be in flight.

### 16. How do you cap concurrent requests?
- Template: a queue with a concurrency limit; refill as each finishes.
- Scene: chunked uploads, bulk APIs.
- Pitfall: retry, timeout, cancel.

## C. Browser and network (17–24)

### 17. URL to pixels?
- Template: DNS → TCP/TLS → HTTP → parse HTML/CSS/JS → render.
- Scene: slow first paint — walk the chain.
- Pitfall: blocking resources delay first paint.

### 18. Strong cache vs negotiated cache?
- Template: strong cache returns locally; negotiated cache asks the server for 304.
- Scene: static assets = strong cache + hash; API data = negotiated.
- Pitfall: cache policy must move with releases.

### 19. Status codes?
- Template: 2xx ok, 3xx redirect, 4xx client, 5xx server.
- Scene: `200/204/301/302/304/401/403/404/500`.
- Pitfall: `401` unauthenticated; `403` authenticated but forbidden.

### 20. HTTP/1.1 vs 2 vs 3?
- Template: HTTP/2 multiplexing + HPACK; HTTP/3 on QUIC, less head-of-line blocking.
- Scene: many parallel assets — HTTP/2/3 wins.
- Pitfall: needs server / CDN support.

### 21. Why CORS? How do you fix it?
- Template: same-origin policy; CORS, reverse proxy, `postMessage`.
- Scene: split frontend/backend → dev proxy.
- Pitfall: JSONP is GET-only, not a general fix.

### 22. When does OPTIONS preflight fire?
- Template: non-simple requests; the server must allow origin / method / headers.
- Scene: custom headers, PUT / DELETE.
- Pitfall: failed preflight is usually incomplete CORS config.

### 23. Cookie / localStorage / sessionStorage?
- Template: Cookie is small and may ride on requests; `localStorage` persists; `sessionStorage` is tab-scoped.
- Scene: session via HttpOnly Cookie or a token scheme.
- Pitfall: don’t dump secrets in local storage.

### 24. XSS and CSRF?
- Template: XSS → encode / sanitize; CSRF → SameSite, CSRF token, double-submit.
- Scene: rich text and form APIs are high risk.
- Pitfall: frontend-only filters are not enough.

## D. Perf and monitoring (25–30)

### 25. Web Vitals?
- Template: FCP, LCP, CLS, INP (FID is the old one).
- Scene: judge work on real-user metrics.
- Pitfall: lab-only numbers miss RUM.

### 26. How do you improve LCP?
- Template: first-paint main resource: compress/preload images, less blocking, SSR/SSG.
- Scene: biggest win when the LCP element is a hero image.
- Pitfall: shrinking JS while ignoring the LCP image.

### 27. High CLS?
- Template: reserve size for images/ads; don’t shove layout with late inserts.
- Scene: skeletons and lazy blocks need a fixed slot.
- Pitfall: font swap can also shift layout.

### 28. Where do you start first-paint work?
- Template: measure first, then priority, code split, cache, render.
- Scene: bucket the bottleneck as network / CPU / paint.
- Pitfall: optimize then measure = wasted work.

### 29. How do you catch all frontend errors?
- Template: `onerror` + `unhandledrejection` + framework boundaries + resource errors.
- Scene: an SDK that collects, dedups, samples, reports.
- Pitfall: monitoring must not slow the product.

### 30. How do Source Maps restore a stack?
- Template: map minified positions back to source lines; version must match the map.
- Scene: production stack traces.
- Pitfall: leaked maps are a security issue — gate access.

## E. Frameworks (31–36)

### 31. Vue reactivity?
- Template: Vue 3 uses Proxy to track deps and trigger updates.
- Scene: precise deps, fewer wasted updates.
- Pitfall: destructure and you lose reactivity.

### 32. Why is React “fast”?
- Template: Fiber can pause, commit is minimal, components keep state local.
- Scene: large pages update in smaller grains.
- Pitfall: blind `memo` can cost more than it saves.

### 33. Hook rules?
- Template: call at the top of the function so the order is stable.
- Scene: custom Hooks for reuse.
- Pitfall: missing deps → stale closures.

### 34. Vue vs React diff?
- Template: both compare same-level nodes and reuse with `key`; scheduler and details differ.
- Scene: stable list keys avoid rebuilds.
- Pitfall: `index` as `key` breaks on reorder.

### 35. When a store?
- Template: cross-tree sharing, heavy derived state, or you need replay/debug.
- Scene: admin permissions, filters, cross-page cache.
- Pitfall: a store on a small app is extra complexity.

### 36. Route auth?
- Template: before-guard for login + dynamic routes + 403 fallback.
- Scene: admin menus by role.
- Pitfall: frontend auth is UX, not the security boundary.

## F. Engineering (37–42)

### 37. Webpack vs Vite?
- Template: Webpack bundles first; Vite serves ESM on demand in dev.
- Scene: large legacy → Webpack; new apps → Vite.
- Pitfall: plugin ecosystem and build-chain compatibility on migrate.

### 38. Loader vs Plugin?
- Template: Loader transforms a module; Plugin hooks the compiler lifecycle.
- Scene: TS/CSS → Loader; analyze/inject → Plugin.
- Pitfall: don’t mix the two jobs.

### 39. When does tree-shaking work?
- Template: ESM static analysis + unused-export marks + minify drops dead code.
- Scene: util libraries imported à la carte.
- Pitfall: side-effectful modules block shaking.

### 40. Why a standards workflow?
- Template: ESLint + Prettier + Husky + lint-staged + commitlint → quality and cheaper collaboration.
- Scene: catch silly mistakes before CI.
- Pitfall: rules that are too strict slow people down — roll out in stages.

### 41. CI/CD for frontend?
- Template: auto test, build, release; fewer human mistakes, higher ship rate.
- Scene: multi-env release and rollback as a standard path.
- Pitfall: a pipeline with no quality gate is theater.

### 42. Test layering?
- Template: unit tests on core logic; E2E on critical paths.
- Scene: login, pay, permission must have E2E.
- Pitfall: 100% coverage is a fantasy; critical paths first.

## G. Scenarios (43–47)

### 43. Large file upload?
- Template: chunk + resume + instant-upload check + server merge and hash.
- Scene: large video / data packs.
- Pitfall: too much concurrency raises failure rate.

### 44. Huge lists?
- Template: virtual list cuts DOM; time slicing cuts long tasks.
- Scene: 10k+ logs / messages.
- Pitfall: variable height needs a height cache and offset correction.

### 45. Permission system?
- Template: identity, role, resource; frontend for display, backend for the real check.
- Scene: routes, menus, buttons, APIs together.
- Pitfall: frontend-only ACL is privilege escalation waiting to happen.

### 46. Monitoring SDK?
- Template: collect (error / perf / behavior) → buffer → report (sample / retry) → platform.
- Scene: production stability.
- Pitfall: redact PII.

### 47. Shared component library?
- Template: consistent APIs, theming, docs, tests, versioning.
- Scene: one UI language across product lines.
- Pitfall: over-abstraction slows the business.

## H. Frontier + project + HR (48–50)

### 48. When SSR vs SSG?
- Template: SSR for dynamic first paint and SEO; SSG for stable content.
- Scene: marketing / content → SSG; personalization → SSR.
- Pitfall: hydration mismatch.

### 49. How do you tell a project highlight?
- Template: STAR — situation, task, action, result (must quantify).
- Scene: perf, architecture, stability.
- Pitfall: “what I did” without why and result.

### 50. HR: why us?
- Template: business direction + the role’s technical challenge + your growth path.
- Scene: read the JD, the product, the stack.
- Pitfall: empty praise or only money.

---

## Sprint (pair with Day 14)

- Pick 20 of 50 for closed-book oral, ≤1 minute each.
- For stalls, write 3 keywords, then redo.
- Before the interview, only your own keyword cards — no new sprawl.
