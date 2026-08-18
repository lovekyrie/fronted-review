# Daily oral sets (14 days × 10 questions)

How to use: 10 questions a day, in order, ~1 minute each.  
Suggested shape: **definition / principle → scene → pitfall / trade-off → a project example of yours**.

## Day 1 (JS basics)

1. How do you classify JS types? Why is `null` special?
2. When `typeof` vs `instanceof` vs `Object.prototype.toString.call`?
3. How do you remember `this` binding rules and priority?
4. What does `new` actually do?
5. How does prototype lookup work?
6. What is a closure? Common uses and risks?
7. `let` vs `const` vs `var`?
8. Arrow functions vs normal functions — the real differences?
9. Debounce vs throttle in a product?
10. Shallow vs deep copy? Edge cases?

## Day 2 (async and event loop)

1. Full Event Loop flow?
2. Macrotasks vs microtasks — examples?
3. Why does `Promise.then` run before `setTimeout`?
4. Promise states and why they don’t reverse?
5. Why can you keep chaining `then`?
6. What is `async/await` under the hood?
7. When `Promise.all` vs `race` vs `allSettled`?
8. How do you cap concurrent requests (e.g. 5)?
9. How do you handle async errors without dropping them?
10. How would you refactor callback hell?

## Day 3 (DOM / BOM / events)

1. Common DOM query and node APIs?
2. How do you cut the cost of frequent DOM work?
3. Capture, target, bubble?
4. What is event delegation? Why is it faster?
5. `stopPropagation` vs `preventDefault`?
6. `history.pushState` vs `location.href`?
7. Why can SPA routing switch without a reload?
8. How do you use `CustomEvent` for component communication?
9. Typical `IntersectionObserver` uses?
10. When is `navigator.sendBeacon` the right reporter?

## Day 4 (memory and perf basics)

1. Browser GC (mark-and-sweep) in one take?
2. Common frontend leak scenes?
3. Why do WeakMap / WeakSet help?
4. How do you find leaks in Chrome DevTools?
5. First paint is slow — which metrics first?
6. What is a Long Task? How do you shrink it?
7. Reflow vs repaint?
8. Why is `transform` usually smoother than `left/top`?
9. Debounce / throttle as perf tools?
10. How do you prove an optimization actually got faster?

## Day 5 (HTML/CSS and mobile)

1. What is BFC? How do you trigger it?
2. What layout problems does BFC actually fix?
3. `content-box` vs `border-box`?
4. When Flex vs Grid?
5. Common responsive approaches?
6. rem vs vw — trade-offs?
7. The 1px problem?
8. Safe-area adaptation?
9. CSS Modules vs CSS-in-JS vs Tailwind?
10. How do you balance CSS maintainability and speed of delivery?

## Day 6 (Vue / React internals)

1. Why did Vue 3 switch to Proxy?
2. React’s render pipeline and Fiber’s core value?
3. Why virtual DOM?
4. Why can’t Hooks sit in a condition?
5. How does the `useEffect` dependency array avoid the stale-closure trap?
6. Vue vs React diff — shared ideas and differences?
7. Why does `key` matter in lists?
8. When must you introduce a store?
9. Component communication options — how do you pick?
10. Framework perf work you actually shipped?

## Day 7 (phase mock 1)

1. 3-minute self-intro (technical).
2. One JS internals question (`this` / prototype).
3. One async question (Event Loop / Promise).
4. One DOM event question (delegation / bubble).
5. One framework question (Vue or React).
6. One network question (cache / CORS).
7. One perf question (metric + action + result).
8. One engineering question (Webpack vs Vite).
9. One scenario (large upload or permissions).
10. The question you know least today, plus a fix plan.

## Day 8 (engineering)

1. Webpack vs Vite under the hood?
2. How would you draw Webpack’s build pipeline?
3. Loader vs Plugin?
4. Tree-shaking — how and when it works?
5. Why is Vite’s dev start and HMR faster?
6. Bundle too large — how do you locate the bloat?
7. How would you write a tiny Webpack plugin?
8. How ESLint works (AST)?
9. Value of Husky + lint-staged + commitlint?
10. How do you land standards without annoying the team?

## Day 9 (testing and quality)

1. Why automate frontend tests?
2. Unit vs integration vs E2E boundaries?
3. Jest vs Vitest in practice?
4. What logic should get unit tests first?
5. Which paths must have E2E?
6. How do you explain coverage (lines / functions / branches)?
7. Why high coverage ≠ high quality?
8. How do you set a CI quality gate?
9. Value and side effects of mocks?
10. How do you explain test ROI to product?

## Day 10 (network / cache / security)

1. URL to pixels, the full chain?
2. Strong cache + negotiated cache as a pair?
3. How does 304 work?
4. HTTP/2 / HTTP/3 core wins?
5. Why CORS? How do you configure it?
6. Simple vs non-simple requests?
7. Common reasons a preflight fails?
8. Cookie vs token — trade-offs?
9. XSS vectors and defenses?
10. Why does CSRF defense need the backend?

## Day 11 (perf monitoring and errors)

1. Core Web Vitals?
2. How do you collect LCP / CLS / INP in production?
3. High LCP — which resources first?
4. Common CLS root causes?
5. INP is bad — typical fixes?
6. How do you design the error-capture chain?
7. What does `window.onerror` miss?
8. Role of `unhandledrejection`?
9. How Source Maps restore a stack?
10. Sampling, rate limits, retries in a monitoring SDK?

## Day 12 (scenarios and system design)

1. Chunked large-file upload, end to end?
2. Resume — how do you keep state consistent?
3. Instant upload without false hits (hash design)?
4. Huge lists: perf and interaction together?
5. Why does time slicing feel smoother?
6. Route auth vs button auth, together?
7. SSO flow, clearly?
8. QR login — core flow and safety?
9. How would you design a frontend monitoring SDK?
10. How would you design a reusable component library?

## Day 13 (frontier + project + HR)

1. SSR vs SSG — when?
2. What is hydration? Why mismatch?
3. Micro-frontends — value vs cost?
4. Qiankun vs Module Federation?
5. Cross-end (mini-program / RN / Flutter) — your mental model?
6. STAR: one project highlight.
7. One full production incident you owned.
8. Where did your biggest technical growth come from?
9. Why this company?
10. Cross-team conflict — what did you do?

## Day 14 (full mock 2)

1. 3-minute self-intro (formal).
2. 5-minute project (with numbers).
3. 1 JS internals (random).
4. 1 async / event-loop (random).
5. 1 network / cache / security (random).
6. 1 framework internals (random).
7. 1 engineering (random).
8. 1 scenario / system design (random).
9. 2 HR (random).
10. Last 5 minutes: the 3 worst answers today?

---

## Scoring (10 per question)

- Structure (2): conclusion first.
- Correctness (3): no mix-ups.
- Scene (2): lands on a real product.
- Trade-off (2): boundaries and cost.
- Pace (1): no looping; done in 60s.

> If the day scores under 70, restudy yesterday’s 3 lowest first tomorrow.
