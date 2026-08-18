# Senior frontend 80-day Daily Prep

Daily execution list split from `sprint-14-days` + `advanced/senior-frontend-roadmap`. One `dayN-<slug>.md` per day, four stages: **input → output → drill → recap**.

## How to use

- Daily budget: **2–3 hours**
- Stack emphasis: **Vue primary / React secondary**
- Every day must have a **visible output**: cheat sheet / flow / handwritten snippet / recording
- Every 7 days: a mock or stage recap to close gaps
- Template: [`_template.md`](./_template)

## Stage overview

| Stage | Days | Topic | Points to |
|------|------|------|------|
| 1. Foundations | Day 1–14 | JS / browser / HTML&CSS / algorithms & handwritten | [`sprint-14-days`](../sprint-14-days) |
| 2. Build pipeline | Day 15–21 | Modules / Babel / Vite / webpack | [`advanced/week1`](../advanced/week1/roadmap) |
| 3. Deploy & ship | Day 22–28 | GitHub Actions / Docker / Nginx | [`advanced/week2`](../advanced/week2/roadmap) |
| 4. Vue internals | Day 29–42 | Reactivity / compile / render / mini-vue | [`advanced/week3`](../advanced/week3/roadmap) |
| 5. React mechanics | Day 43–49 | render / effect / concurrent / React 19 | [`advanced/week4`](../advanced/week4/roadmap) |
| 6. TypeScript | Day 50–56 | Generics / conditionals / mapped / type design | [`advanced/week5`](../advanced/week5/roadmap) |
| 7. Perf & security | Day 57–63 | Event loop / Web Vitals / XSS/CSRF | [`advanced/week6`](../advanced/week6/roadmap) |
| 8. Testing | Day 64–70 | Layering / Vitest / Playwright | [`advanced/week7`](../advanced/week7/roadmap) |
| 9. Architecture & mocks | Day 71–80 | Scenarios / micro-frontends / monitoring / mocks | [`advanced/week8`](../advanced/week8/roadmap) |

## Daily index

### Stage 1: Foundations

- [Day 1 JS types / this / prototype chain](./day01-js-foundation-checklist)
- [Day 2 Closures / scope / ES6](./day02-closure-scope-es6)
- [Day 3 Async and the event loop](./day03-async-event-loop)
- [Day 4 DOM / BOM / events](./day04-dom-bom-event)
- [Day 5 Memory and browser rendering](./day05-memory-browser-render)
- [Day 6 HTTP / cache / CORS / storage](./day06-http-cache-cross-origin)
- [Day 7 Basics mock 1](./day07-basic-mock-1)
- [Day 8 HTML/CSS high-frequency layout](./day08-html-css-layout)
- [Day 9 Semantics / compat / animation](./day09-semantic-compat-animation)
- [Day 10 Algorithm warmup 1](./day10-algorithm-warmup)
- [Day 11 Handwritten warmup 1](./day11-handwrite-warmup-1)
- [Day 12 Handwritten warmup 2](./day12-handwrite-warmup-2)
- [Day 13 Vue / React basics warmup](./day13-framework-preheat)
- [Day 14 Basics mock 2](./day14-basic-mock-2)

### Stage 2: Build pipeline

- [Day 15 ESM vs CommonJS vs UMD](./day15-modules-esm-cjs)
- [Day 16 Babel: AST / preset / plugin](./day16-babel-ast)
- [Day 17 Vite internals](./day17-vite-principle)
- [Day 18 webpack core](./day18-webpack-core)
- [Day 19 Code splitting / Tree Shaking / cache](./day19-code-splitting-tree-shaking)
- [Day 20 Production build practice](./day20-production-build)
- [Day 21 Build follow-up recap](./day21-build-review)

### Stage 3: Deploy & ship

- [Day 22 GitHub Actions](./day22-github-actions)
- [Day 23 Docker basics](./day23-docker-basics)
- [Day 24 Nginx config](./day24-nginx-config)
- [Day 25 Env vars and build modes](./day25-env-and-mode)
- [Day 26 Release and rollback](./day26-release-rollback)
- [Day 27 Production troubleshoot checklist](./day27-online-troubleshoot)
- [Day 28 Deploy recap](./day28-deploy-review)

### Stage 4: Vue internals

- [Day 29 Proxy / Reflect and the reactivity entry](./day29-vue-proxy-reflect)
- [Day 30 track / trigger / effect](./day30-vue-track-trigger)
- [Day 31 Scheduler and async updates](./day31-vue-scheduler)
- [Day 32 ref / reactive / computed / watch](./day32-vue-ref-reactive-computed-watch)
- [Day 33 Vue 2 vs Vue 3 reactivity](./day33-vue2-vs-vue3-reactivity)
- [Day 34 Template compile pipeline](./day34-vue-compiler)
- [Day 35 Patch Flag / static hoisting / Block Tree](./day35-vue-patch-flag)
- [Day 36 Renderer and diff](./day36-vue-renderer)
- [Day 37 Component update and scheduling](./day37-vue-component-update)
- [Day 38 Handwrite mini-vue reactivity](./day38-mini-vue-reactivity)
- [Day 39 Handwrite mini-vue renderer](./day39-mini-vue-renderer)
- [Day 40 Vue Router internals](./day40-vue-router)
- [Day 41 Pinia / Vuex](./day41-pinia-vuex)
- [Day 42 Vue SSR / Nuxt + follow-ups](./day42-vue-ssr-review)

### Stage 5: React mechanics

- [Day 43 render / commit / batching](./day43-react-render-commit)
- [Day 44 state queue and functional updates](./day44-react-state-queue)
- [Day 45 useEffect traps](./day45-react-useeffect)
- [Day 46 useMemo / useCallback / memo](./day46-react-memo-callback)
- [Day 47 useTransition / useDeferredValue](./day47-react-concurrent)
- [Day 48 React 19 features](./day48-react19-features)
- [Day 49 RSC + React follow-ups](./day49-react-rsc-review)

### Stage 6: TypeScript

- [Day 50 Type basics / literals / unions](./day50-ts-basics)
- [Day 51 Generics and constraints](./day51-ts-generics)
- [Day 52 Conditional types and infer](./day52-ts-conditional-infer)
- [Day 53 Mapped types and keyof](./day53-ts-mapped)
- [Day 54 Template literal types](./day54-ts-template-literal)
- [Day 55 Handwrite utility types + JS→TS](./day55-ts-utility-types)
- [Day 56 Type design practice + follow-ups](./day56-ts-design-review)

### Stage 7: Perf & security

- [Day 57 Event loop details](./day57-event-loop-detail)
- [Day 58 Browser render pipeline](./day58-browser-render-pipeline)
- [Day 59 Web Vitals](./day59-web-vitals)
- [Day 60 First-paint optimization](./day60-first-paint-optimization)
- [Day 61 HTTP cache + Service Worker](./day61-http-cache-service-worker)
- [Day 62 XSS / CSRF / CSP](./day62-xss-csrf-csp)
- [Day 63 Perf & security follow-ups](./day63-perf-security-review)

### Stage 8: Testing

- [Day 64 Test layering](./day64-test-layering)
- [Day 65 Vitest basics](./day65-vitest-basics)
- [Day 66 Vue component testing](./day66-vue-component-testing)
- [Day 67 Mock / Spy / coverage](./day67-mock-coverage)
- [Day 68 Playwright E2E](./day68-playwright-e2e)
- [Day 69 Tests for handwrite/promise](./day69-handwrite-promise-test)
- [Day 70 Testing follow-ups](./day70-testing-review)

### Stage 9: Architecture & mocks

- [Day 71 Scenario: large-file upload](./day71-scenario-file-upload)
- [Day 72 Scenario: massive data / virtual list](./day72-scenario-virtual-list)
- [Day 73 Scenario: permission system](./day73-scenario-permission)
- [Day 74 Micro-frontends + mobile / cross-platform](./day74-micro-frontend)
- [Day 75 Monitoring / observability](./day75-monitoring-observability)
- [Day 76 Project recap: polish STAR](./day76-project-review-star)
- [Day 77 Resume + HR drill](./day77-resume-hr-practice)
- [Day 78 Mock 1 (pure tech)](./day78-mock-interview-1)
- [Day 79 Mock 2 (mixed)](./day79-mock-interview-2)
- [Day 80 Final gap-fill](./day80-final-review)
