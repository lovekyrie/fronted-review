---
title: Week 8 Senior Frontend Question Bank
description: 30 high-frequency Q&A items and project talking points for senior frontend interviews
---

# Week 8 Senior Frontend Question Bank

Week 8 is not about adding more topics. It is about turning the first 7 weeks into answers you can deliver stably in a senior frontend interview.

Senior interviews rarely stop at definitions. They care whether you can connect mechanisms, engineering trade-offs, risk boundaries, and real projects. For every question, answer in this order:

```text
Lead with the conclusion -> explain the chain -> discuss trade-offs -> cover the risks -> land it in a project
```

## 1. Engineering and Build

### 1. Why is Vite usually faster than webpack in development?

**Question**: Why does Vite start fast and hot-reload fast? Does it skip bundling entirely?

**Core answer**:

In development, Vite uses native browser ESM. It does not need to bundle the whole application dependency graph up front. The browser requests a module, and the dev server transforms and returns that module. Third-party dependencies are pre-bundled so CommonJS / UMD become easier to consume as ESM, and so thousands of tiny module requests are reduced. In production Vite still bundles, usually with Rollup, to handle code splitting, minification, hashing, tree-shaking, and other optimizations.

**Follow-up angles**:

- Native ESM on-demand loading
- Dependency pre-bundling
- HMR module boundaries
- Separate dev and build pipelines
- Control-surface differences between Vite and webpack

**Project framing**:

If a project starts slowly in development, I first separate whether there are too many source modules, slow dependency pre-bundling, or slow plugin transforms. Vite’s strength is development feedback, but production builds still need attention to splitting, caching, and source maps.

**Related docs**: [Week 1 Build Tools](../week1/build-tools), [Week 1 Modules](../week1/modules)

### 2. Why does tree-shaking depend on ESM?

**Question**: How does tree-shaking work? Why is it often weak with CommonJS?

**Core answer**:

The goal of tree-shaking is to drop unused exports. That depends on statically analyzing import/export relationships at build time. ESM `import` / `export` are syntactic, static declarations, so a bundler can know what a module exports and what callers use without executing the code. CommonJS `require()` is a runtime function call and can sit inside conditionals, so static analysis is much harder.

**Follow-up angles**:

- ESM static structure
- CommonJS runtime loading
- Side-effectful code
- The `sideEffects` flag
- How import style affects bundle size

**Project framing**:

If bundle size looks off, I use a bundle analyzer to check for CommonJS dependencies, accidental whole-package imports, module side effects, or a bad `sideEffects` config — not just “turn on tree-shaking”.

**Related docs**: [Week 1 Modules](../week1/modules), [Week 1 Build Tools](../week1/build-tools)

### 3. Why do production builds need code splitting and long-term caching?

**Question**: In a frontend production build, how should hash, chunks, and caching be designed?

**Core answer**:

Code splitting defers code that the first screen does not need, cutting download and parse cost. Long-term caching lets unchanged static assets hit the browser cache for a long time. JS/CSS files usually get a content hash, while HTML is set to no strong cache or a short cache, because HTML is what points at the latest assets. A stable vendor chunk can improve cache hits, but splitting too finely adds request and scheduling cost.

**Follow-up angles**:

- Route-level dynamic import
- Vendor splitting
- Content hash
- Different cache policies for HTML vs static assets
- Source map publishing strategy

**Project framing**:

I design caching together with release strategy: HTML stays easy to update, hashed static assets are cached long-term, and on rollback the old HTML can still reach the old assets it references.

**Related docs**: [Week 1 Build Tools](../week1/build-tools), [Week 6 Performance Optimization](../week6/performance-optimization)

### 4. What are the boundaries among Babel, TypeScript, and the bundler?

**Question**: What do Babel, tsc, and webpack/Vite each own?

**Core answer**:

Babel mainly handles syntax transforms and plugin-based AST transforms. The TypeScript compiler owns type checking and type erasure. The bundler starts from an entry, builds the module graph, and emits deployable artifacts. Polyfills fill in missing runtime APIs; they are not syntax transforms. Real projects often use all of them together, but the boundaries differ.

**Follow-up angles**:

- Syntax transform vs module bundling
- Type checking vs type erasure
- Runtime polyfill
- Loader / plugin boundaries
- Splitting build speed from type checking

**Project framing**:

On large projects I treat type checking and the transpile pipeline separately: fast transpile for development feedback, full type checking and build validation in CI.

**Related docs**: [Week 1 Build Tools](../week1/build-tools), [Week 5 TypeScript Basics](../week5/typescript-basic)

## 2. Deployment and Delivery

### 5. What should a complete frontend CI/CD pipeline include?

**Question**: How do you understand frontend CI/CD? Is writing GitHub Actions enough?

**Core answer**:

A complete pipeline is usually: commit code, trigger a workflow, install dependencies, run quality checks, build artifacts, build an image or upload artifacts, deploy to the target environment, then verify and roll back. CI is about finding change problems early. CD is about delivering a verifiable artifact stably. Auto-deploy without quality gates, verification, and rollback is not complete CI/CD.

**Follow-up angles**:

- Different jobs for PR vs mainline
- Type checking, tests, and build validation
- Docker images as the delivery unit
- Post-deploy verification
- Rollback strategy

**Project framing**:

I use the PR stage for quality gates and the main branch for build and deploy, and I require a health check or smoke test after deploy so we do not “automatically ship bugs to production”.

**Related docs**: [Week 2 CI/CD](../week2/ci-cd), [Week 2 Deployment](../week2/deployment)

### 6. What problem does Docker solve in frontend deployment?

**Question**: Frontend is just static files, right? Why Docker?

**Core answer**:

The frontend may end up as static files, but Docker freezes the build output and runtime into one delivery unit. A common pattern is multi-stage builds: a Node stage installs dependencies and builds, then an Nginx image serves the static assets. The runtime image stays smaller, production is more stable, and rolling back to a tagged image is easier.

**Follow-up angles**:

- Multi-stage builds
- Separating build environment from runtime
- Image tag strategy
- GHCR / Docker Registry
- Container restart and health checks

**Project framing**:

I avoid building on production servers. CI produces the image; servers only pull and run it, so local, CI, and production stay consistent.

**Related docs**: [Week 2 Deployment](../week2/deployment), [Week 2 CI/CD](../week2/ci-cd)

### 7. How do you debug and roll back quickly after a frontend release?

**Question**: A production release went wrong. How do you locate the issue and roll back?

**Core answer**:

First judge the blast radius: whole-site outage, some routes broken, static asset 404s, API failures, or browser compatibility. Then check deploy records, image versions, Nginx logs, the browser console, network requests, and monitoring metrics. Rollback depends on traceable artifacts such as image tags or static-asset versions, not ad-hoc edits on the server.

**Follow-up angles**:

- Deploy logs
- Static asset 404s
- Nginx route fallback
- Source maps for locating errors
- Image rollback

**Project framing**:

I want every release to have a version, an artifact record, and a rollback entry. For frontend asset issues, I first check whether HTML-referenced files exist, whether cache is polluted, and whether Nginx fallback is correct.

**Related docs**: [Week 2 Deployment](../week2/deployment), [Week 6 Performance Optimization](../week6/performance-optimization)

### 8. What are the risks of environment variables in frontend build and deploy?

**Question**: How should frontend env vars be managed? What must not go in them?

**Core answer**:

Frontend env vars are usually baked into static artifacts after the build, so they are visible in the browser. Secrets, database passwords, and private tokens must not go there. They are fine for public environment labels, API base URLs, feature flags, and similar. Also distinguish build-time variables from runtime config. If a static site must switch environments at runtime, you usually need an external config file or server-side injection.

**Follow-up angles**:

- Build-time injection
- Runtime configuration
- Secret leakage
- Multi-environment releases
- CI secrets management

**Project framing**:

I keep sensitive data on the server or in CI secrets, and only inject what the browser is allowed to see. For multi-environment deploys, I avoid rebuilding per environment when that would make artifacts non-reusable.

**Related docs**: [Week 2 Deployment](../week2/deployment), [Week 6 Security](../week6/security)

### 8.1 How should a frontend observability system be designed?

**Question**: If you owned frontend production governance, how would you build the monitoring system?

**Core answer**:

Frontend observability should at least cover error monitoring, performance monitoring, behavior tracking, and release-version correlation. Errors answer “what broke”, performance answers “what is slow”, tracking answers “which business was affected”, and version correlation answers “which release started it”. The real value is not collection itself, but the closed loop of alerting, debugging, rollback, and postmortem.

**Follow-up angles**:

- `window.onerror` / `unhandledrejection`
- Web Vitals
- Binding source maps to a release
- Sampling, rate limiting, and redaction
- Alert severity levels

**Project framing**:

I especially emphasize version correlation and watching the release window. Many production issues are not “do we have data”, but “can we quickly tell whether this release introduced the problem”.

**Related docs**: [Error Monitoring and Exception Handling](../../network&broswer/error-monitoring), [Web Vitals](../../network&broswer/web-vitals), [Observability System](../../network&broswer/observability-system)

**Related overview**: [Senior Frontend 8-Week Roadmap](../senior-frontend-roadmap)

## 3. Vue Internals

### 9. Why did Vue 3 choose Proxy for reactivity?

**Question**: How does Vue 2 reactivity differ from Vue 3?

**Core answer**:

Vue 2 intercepts existing properties with `Object.defineProperty`. Adding properties, deleting properties, array indexes, and collection types all need extra handling. Vue 3 proxies the whole object, intercepting `get`, `set`, `deleteProperty`, `ownKeys`, and more, with fuller semantics for arrays, Map, and Set. This is not only a performance change; more importantly, reactivity coverage is more complete.

**Follow-up angles**:

- `track` / `trigger`
- `WeakMap -> Map -> Set`
- `ReactiveEffect`
- Historical reasons for `Vue.set`
- Deep vs shallow reactivity

**Project framing**:

For large datasets or third-party instances, I do not default to deep proxying. I consider `shallowRef`, `shallowReactive`, or `markRaw` to avoid unnecessary proxy cost and object-semantics changes.

**Related docs**: [Week 3 Reactivity](../week3/reactivity)

### 10. What is the essential difference between computed and watch in Vue?

**Question**: How do you choose among computed, watch, and watchEffect?

**Core answer**:

`computed` describes a value derived from existing state. Internally it is a lazy effect that uses a `dirty` flag for caching and invalidation. `watch` listens to an explicit source and runs a side effect, and can receive old and new values. `watchEffect` automatically collects dependencies read during its synchronous run, which fits cases where sources are scattered but the side effect is direct.

**Follow-up angles**:

- Lazy computed
- Getter purity
- Watch cleanup
- `flush: post`
- Canceling async requests

**Project framing**:

I put derived data in computed, and requests, tracking, cache writes, and DOM access in watch. For search requests, I use cleanup in watch to cancel stale requests.

**Related docs**: [Week 3 Reactivity](../week3/reactivity)

### 11. Why does Vue 3 rendering emphasize compile-time optimization?

**Question**: What are patch flags, static hoisting, and the block tree for?

**Core answer**:

Vue templates can be statically analyzed at compile time. The compiler already knows which nodes are static and which attributes are dynamic. Static hoisting avoids recreating and comparing the same nodes. Patch flags tell the runtime exactly what can change. The block tree collects dynamic nodes so updates shrink from the whole tree to a dynamic-node list. Vue 3’s advantage is not “no virtual DOM”, but doing less runtime diff with compiler hints.

**Follow-up angles**:

- Render function
- vnode
- Component render effect
- Scheduler
- Keyed children diff

**Project framing**:

When a page has a lot of static structure and a little dynamic content, Vue’s compile-time optimizations pay off. Before reaching for `v-memo`, I first confirm there is a real large-list or local-update bottleneck.

**Related docs**: [Week 3 Rendering Mechanism](../week3/rendering-mechanism)

### 12. Why does Vue list diff need a stable key?

**Question**: Why is index a bad key?

**Core answer**:

A key identifies a sibling node’s stable identity so Vue can decide reuse, move, insert, or delete. An index does not stably represent a business item under insert, delete, or reorder, so DOM nodes or component instances can be reused wrongly. For disordered lists, Vue builds a key-to-index map and uses the longest increasing subsequence to reduce DOM moves.

**Follow-up angles**:

- Head/tail sync
- Key-to-new-index map
- Node reuse
- Longest increasing subsequence
- Component state mismatch

**Project framing**:

For business lists I prefer a database id or other unique business id as the key. Index is relatively acceptable only for purely static display lists that never reorder, insert, or delete.

**Related docs**: [Week 3 Rendering Mechanism](../week3/rendering-mechanism)

## 4. React Internals

### 13. Why can’t Hooks be called inside conditions?

**Question**: Why does React require Hooks to be called at the top level?

**Core answer**:

Hook state lives on the Fiber for that function component. Multiple Hooks in one component form a linked list in call order. React does not identify Hooks by variable name; it matches each render’s call order to the previous Hook nodes. Conditional calls break that order and misalign state.

**Follow-up angles**:

- Fiber.memoizedState
- Hook linked list
- Render snapshot
- State update queue
- Custom Hook rules

**Project framing**:

If logic must be conditional, I put the condition inside the Hook instead of calling the Hook conditionally. For example, an Effect decides whether to subscribe based on a flag, and cleanup stays complete.

**Related docs**: [Week 4 Hooks](../week4/hooks)

### 14. Why do you still read the old value after React setState?

**Question**: Why is `count` unchanged after `setCount(count + 1)`?

**Core answer**:

React state is a snapshot of one render. `setState` queues an update and schedules the next render; it does not mutate the local variable in the current closure. If the next state depends on the previous one, use a functional update so it is computed from the previous state in the queue.

**Follow-up angles**:

- Render snapshot
- Stale closure
- Update queue
- Automatic batching
- Functional updates

**Project framing**:

On rapid clicks, timers, or Promise callbacks, if the update depends on previous state, I write `setState(prev => next)` so a stale closure does not drop updates.

**Related docs**: [Week 4 Hooks](../week4/hooks)

### 15. What is the right mental model for useEffect?

**Question**: Is useEffect a lifecycle replacement?

**Core answer**:

`useEffect` is better understood as synchronizing with external systems after commit, not a one-to-one lifecycle replacement. Render should stay pure. Effects run after commit for requests, subscriptions, timers, DOM APIs, third-party SDKs, and other side effects. Cleanup runs on unmount or before the next effect run.

**Follow-up angles**:

- Render / commit
- Dependency array
- Stale closure
- Cleanup
- Strict Mode double invoke

**Project framing**:

I avoid deriving internal state in Effects. Values that can be computed during render are computed there; expensive work uses memo; Effects are for actually syncing external systems.

**Related docs**: [Week 4 Hooks](../week4/hooks)

### 16. What problem does React concurrent rendering solve?

**Question**: Is React concurrency multithreading? What is `useTransition` for?

**Core answer**:

React concurrency is not multithreading. It is cooperative scheduling on Fiber. The render phase can be interrupted, retried, or discarded, and urgent updates such as user input can be handled first by priority. `startTransition` / `useTransition` mark non-urgent updates as lower priority so input stays ahead of heavy work like filtering a large list or switching tabs.

**Follow-up angles**:

- Fiber work units
- Interruptible render
- Uninterruptible commit
- Lanes priority
- Suspense with transitions

**Project framing**:

When searching a large list, I keep the input value as a high-priority update and put list filtering into a transition so typing stays smooth, then use a virtual list to cut actual render cost.

**Related docs**: [Week 4 Concurrency](../week4/concurrency)

## 5. TypeScript Design

### 17. What is the value boundary of TypeScript?

**Question**: Can TypeScript guarantee there are no type issues in production?

**Core answer**:

TypeScript mainly works at compile time. It helps catch parameter, return value, object-shape, and state-branch issues during development, but it does not replace runtime validation. Backend responses, URL params, localStorage, and third-party input remain untrusted and need runtime parsing or guards.

**Follow-up angles**:

- Prefer `unknown` over `any`
- Type narrowing
- Custom type guards
- Runtime schema
- Compile-time vs runtime boundary

**Project framing**:

I treat API responses as `unknown` first, then move them into the business model through type guards or schema validation, instead of asserting untrusted data into business types.

**Related docs**: [Week 5 TypeScript Basics](../week5/typescript-basic)

### 18. What matters in generic design?

**Question**: Are generics just writing `<T>`?

**Core answer**:

The value of generics is keeping constraints while preserving what the caller passed in. A good generic API is not “accept any type”; it uses `extends`, `keyof`, indexed access types, conditional types, and similar tools to express the relationship between input and output. The goal is that callers write fewer types and the compiler infers more.

**Follow-up angles**:

- Generic constraints
- `keyof`
- `T[K]`
- Default type parameters
- Conditional types

**Project framing**:

When wrapping tables, forms, or request helpers, I bind field names, return values, and component props in the type system so renaming a business field does not silently pass at call sites.

**Related docs**: [Week 5 Type Design](../week5/typescript-design)

### 19. How do you model a business state machine in TypeScript?

**Question**: How should request state and form state be modeled more safely?

**Core answer**:

A discriminated union fits mutually exclusive states better than several loose booleans. Request state can be `idle`, `loading`, `success`, or `error`, each carrying different fields. Rendering narrows on the discriminant, and `never` is used for exhaustiveness so a new state cannot be left unhandled.

**Follow-up angles**:

- Discriminated union
- Exhaustive check
- `never`
- Mutually exclusive states
- Modeling UI branches

**Project framing**:

I do not let `loading + data + error` combine into every possible mix. A discriminated union constrains legal states and avoids inconsistent data such as “loading and success at the same time”.

**Related docs**: [Week 5 TypeScript Basics](../week5/typescript-basic), [Week 5 Type Design](../week5/typescript-design)

### 20. What should you watch when typing a component API?

**Question**: How do you design type-friendly component props?

**Core answer**:

Component API types should express constraints, not make every field optional. Mutually exclusive props can be a union. Controlled vs uncontrolled modes need a clear boundary. Event callback parameters should be derived from the business model. Good component types make illegal combinations fail at compile time.

**Follow-up angles**:

- Mutually exclusive props
- Controlled / uncontrolled
- Generic components
- Event type inference
- Defaults vs optional properties

**Project framing**:

For a generic table or form, I bind column config to the data type so `dataIndex` can only be a real field, and render callbacks receive the correct field type.

**Related docs**: [Week 5 Type Design](../week5/typescript-design)

## 6. Performance and Security

### 21. How do Web Vitals map to concrete optimizations?

**Question**: What do LCP, INP, and CLS mean, and how do you optimize them?

**Core answer**:

LCP is about how fast the largest content element loads. Common work is reducing first-screen blocking, optimizing images, SSR/prerendering, and caching critical assets. INP is about interaction responsiveness: split long tasks, reduce main-thread blocking, and cut re-render cost. CLS is about layout stability: reserve size for images and ads, and avoid inserting content that shoves the page.

**Follow-up angles**:

- First-screen critical path
- Long tasks
- Image optimization
- Font loading
- Layout shift

**Project framing**:

I first use Lighthouse, the Performance panel, and real-user monitoring to tell whether the bottleneck is loading, rendering, or interaction, then optimize accordingly — not a vague “compress assets”.

**Related docs**: [Week 6 Performance Optimization](../week6/performance-optimization)

### 22. How should frontend caching be designed?

**Question**: How do strong cache, negotiated cache, and build hashes work together?

**Core answer**:

Static assets can use a content hash plus long-term strong cache, because a content change changes the filename. HTML usually should not be strongly cached long-term, because it points at the latest assets. API caching should match business freshness, using HTTP cache, in-memory cache, request deduping, or a data-layer cache. Cache strategy must be designed together with release and rollback.

**Follow-up angles**:

- `Cache-Control`
- ETag
- Content hash
- HTML caching
- CDN cache purge

**Project framing**:

I cache static assets long-term and HTML short-term or without strong cache, and I keep old-version assets available through the rollback window so old HTML never points at missing files.

**Related docs**: [Week 6 Performance Optimization](../week6/performance-optimization), [Week 2 Deployment](../week2/deployment)

### 23. What is the essence of XSS and how do you defend against it?

**Question**: How does the frontend prevent XSS?

**Core answer**:

XSS means an attacker injects a malicious script into the page and the browser runs it. The core defense is context-aware output encoding so untrusted content is not executed as HTML. Framework default interpolation escapes, but `v-html`, `dangerouslySetInnerHTML`, and rich-text rendering still need sanitization. CSP is an extra layer that lowers script-execution risk.

**Follow-up angles**:

- Stored / reflected / DOM XSS
- HTML-context escaping
- URL protocol filtering
- Rich-text allowlists
- CSP

**Project framing**:

If the product must support rich text, I use an allowlist sanitizer for tags, attributes, and protocols, plus CSP, instead of trusting HTML from the backend.

**Related docs**: [Week 6 Security](../week6/security)

### 24. How do CSRF and XSS differ?

**Question**: Why can CSRF attack without reading user data?

**Core answer**:

XSS runs a malicious script in the target site’s context. CSRF exploits the browser automatically attaching cookies, tricking a logged-in user into sending an unintended request to the target site. Common CSRF defenses include SameSite cookies, CSRF tokens, Origin / Referer checks, and a second confirmation for sensitive actions.

**Follow-up angles**:

- Cookies sent automatically
- SameSite
- CSRF token
- Origin checks
- Side effects on GET requests

**Project framing**:

For mutating APIs I avoid GET, combine SameSite and CSRF tokens, and let the server check request origin. The frontend cooperates; it does not own the defense alone.

**Related docs**: [Week 6 Security](../week6/security)

## 7. Testing and Quality

### 25. How do you layer unit, component, and E2E tests?

**Question**: How do you apply the frontend testing pyramid?

**Core answer**:

Unit tests cover small units such as pure functions, helpers, and state transitions. Component tests cover interaction and render results. E2E covers critical user paths. Lower layers are faster, more stable, and better for edge cases. Upper layers are closer to real users but cost more and flake more. Layering is about covering the right risk at the right cost.

**Follow-up angles**:

- Vitest unit tests
- Vue / React component tests
- Playwright E2E
- Testing pyramid
- Critical-path smoke tests

**Project framing**:

I put core algorithms and state logic in unit tests, complex component interaction in component tests, and login, checkout, and publish paths in E2E or smoke tests.

**Related docs**: [Week 7 Testing Strategy](../week7/testing-strategy)

### 26. Where is the boundary of mocking?

**Question**: Is more mocking always better in tests?

**Core answer**:

Mocks isolate unstable or expensive external dependencies; they are not there to make tests always pass. Over-mocking detaches tests from real behavior, especially if the logic under test is mocked away. A better approach is to mock boundaries such as network, time, randomness, and browser APIs, while letting core business logic actually run.

**Follow-up angles**:

- Mocking external dependencies
- Fake timers
- MSW
- Contract risk
- Test credibility

**Project framing**:

For API tests I prefer mocking the network boundary with a response shape close to the real API, then add E2E on critical flows so unit-test mocks do not hide contract drift.

**Related docs**: [Week 7 Testing Strategy](../week7/testing-strategy)

### 27. Does high coverage equal high test quality?

**Question**: How do you judge test quality?

**Core answer**:

Coverage only shows that code ran. It does not mean assertions are useful, or that real risk was covered. High-quality tests focus on critical business paths, edge cases, failure scenarios, and regression risk. Coverage can be a floor metric; it cannot replace test design.

**Follow-up angles**:

- Statement / branch coverage
- Critical-path coverage
- Assertion quality
- Flaky tests
- CI quality gates

**Project framing**:

I treat coverage as a trend signal, not the only goal. Core modules need higher coverage and stronger assertions; low-risk display code does not chase 100%.

**Related docs**: [Week 7 Testing Strategy](../week7/testing-strategy)

## 8. Architecture and Project Questions

### 28. How do you design state boundaries in a complex frontend project?

**Question**: What state belongs in a component, and what belongs globally?

**Core answer**:

State boundaries depend on sharing scope, lifetime, and consistency needs. Local interaction state stays in the component. Global state is for data shared across pages or business modules. Server data does not have to enter a global store; a data-fetching layer can cache it. Derived state should be computed, not stored in multiple places that can drift.

**Follow-up angles**:

- Local state
- Global state
- Server state
- Derived state
- URL state

**Project framing**:

I first classify by source: ephemeral UI state, shareable URL state, server-cache state, and global user state. Different kinds get different tools, instead of stuffing everything into one store.

**Related docs**: [Week 4 Hooks](../week4/hooks), [Week 3 Reactivity](../week3/reactivity)

### 29. How do you design an observable frontend production system?

**Question**: How should a senior frontend engineer talk about monitoring and incident response?

**Core answer**:

Frontend observability at least includes error monitoring, performance monitoring, resource-load monitoring, API monitoring, and user-behavior context. Errors should correlate to version, route, user environment, source maps, and release records. Performance should combine Web Vitals with real-user data, not only local Lighthouse.

**Follow-up angles**:

- JS error
- Unhandled rejection
- Resource error
- Web Vitals
- Source map security
- Release correlation

**Project framing**:

I attach a version to every release. Error reports carry release, route, browser, and user-action context, and I connect alerts to the rollback process.

**Related docs**: [Week 2 Deployment](../week2/deployment), [Week 6 Performance Optimization](../week6/performance-optimization)

### 30. How should you answer a project retrospective question?

**Question**: Introduce a complex frontend project you led. How do you tell it?

**Core answer**:

Do not only list pages and features. Cover background, goals, constraints, approach, trade-offs, results, and retrospective. A senior frontend project story should naturally include engineering, performance, stability, testing, monitoring, and collaboration. The point is not stacking every technology, but explaining why those choices solved the problem at the time.

**Follow-up angles**:

- Project background
- Technical constraints
- Architecture layers
- Performance metrics
- Release and rollback
- Quality assurance

**Project framing**:

Prepare it in this structure: what was the business goal, what hurt before, which part I owned, which key decisions I made, what risks showed up, how we verified results, and what engineering capability we kept.

**Related docs**: [Senior Frontend 8-Week Roadmap](../senior-frontend-roadmap), [Week 2 CI/CD](../week2/ci-cd), [Week 7 Testing Strategy](../week7/testing-strategy)

## Final Gap-Check Checklist

Before an interview, self-check with these questions:

1. Can you explain each topic as a mechanism chain, not only a definition?
2. Can you name the applicable scenario, cost, and failure risk for each approach?
3. Can you weave build, deploy, testing, performance, and security into project answers naturally?
4. Can your Vue and React answers reach scheduling and update mechanics?
5. Can your TypeScript answers move from “I can write types” to “I can design APIs”?
6. Can you go from a performance metric to a concrete optimization?
7. Can you explain test layering and quality trade-offs?
8. Have you prepared at least 3 real project stories, delivered with the same structure?
