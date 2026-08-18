# Day 42 Vue SSR / Nuxt + Vue Topic Follow-up Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 42 | SSR + Vue review | [SSR/SSG](../advanced/ssr-ssg), [Week 3 Roadmap](../advanced/week3/roadmap), [Vue Performance Optimization](../framework/vue/performance-optimization) |

## Today's Goals

- Finish Vue SSR and Nuxt official concepts
- Produce a Vue SSR answer script: isomorphic rendering, hydrate, serialization, environment differences
- Summarize Days 29–41 into a *Vue Track 20-Question Answer Book*

## Reading Checkpoints

- SSR pain points: dual-end API differences (`window / document` cannot be used casually), state serialization, request coalescing
- Typical reasons `hydrate` fails: server and client HTML do not match (timestamps, random numbers, conditional rendering)
- Nuxt 3’s `useAsyncData / useFetch` handle request deduping and state reuse for you

## Cheat Sheet / Knowledge Points

### SSR / SSG / CSR comparison

| Mode | When it renders | First paint | SEO | Server cost | Use cases |
|------|----------|------|-----|-----------|----------|
| CSR | Browser | Slow | Poor | Low | Admin dashboards, SPAs |
| SSR | Every request | Fast | Good | High | Dynamic content, e-commerce |
| SSG | Build time | Fast | Good | Lowest | Blogs, docs, marketing pages |

### Vue SSR flow

```text
1. Browser request → Node server
2. Server: createSSRApp() → inject router/Pinia → renderToString(app)
3. Serialize state: window.__INITIAL_STATE__ = JSON.stringify(piniaState)
4. Return full HTML (including state + app HTML)
5. Client: createSSRApp() → hydrateApp → reuse server DOM → bind events
```

### Hydrate mechanism

- The client does not recreate the DOM; it **reuses** the server-rendered HTML.
- It compares VNodes with the real DOM one by one; if they match, it only binds events.
- On **mismatch**, you get a hydration mismatch: a warning in development, and possible broken behavior in production.

### Common reasons hydration fails

- Server and client render different results (timestamps, `Math.random()`, `Date.now()`).
- Client-only APIs (`window`, `document`) make the server render differently.
- Async data is rendered before the server has finished fetching it.
- `v-if` depends on client-only state, so the two ends produce different HTML structures.

### Nuxt 3 key APIs

| API | Purpose |
|-----|------|
| `useFetch` | Data fetching with automatic deduping + state serialization |
| `useAsyncData` | Async data fetching with a custom key |
| `useState` | SSR-safe shared state |
| `definePageMeta` | Page-level config (layout, middleware) |

## Handwritten / Flowcharts

### Full SSR pipeline

```text
Browser GET /about
  → Node server receives the request
  → createSSRApp() + router.push('/about') + await router.isReady()
  → run setup / onServerPrefetch to fetch data
  → renderToString(app) → HTML string
  → inject <script>window.__INITIAL_STATE__=...</script>
  → return full HTML
  → browser paints HTML (user sees content immediately)
  → load JS → createSSRApp() → hydrate
  → reuse DOM + bind events → page becomes interactive
```

### Handling environment differences

```vue
<script setup>
// Client-only
onMounted(() => {
  // safe to use window / document
})

// Server-only
onServerPrefetch(async () => {
  await fetchData()
})

// Conditional component
</script>
<template>
  <ClientOnly>
    <EchartsChart />
  </ClientOnly>
</template>
```

## Oral Questions

### 1. How do you choose SSR / SSG / CSR?

Answer template:

> The choice depends on three factors: SEO needs, first-paint speed, and how dynamic the data is. If the page is static or updates infrequently (blogs, docs), use SSG: generate HTML at build time, deploy to a CDN — fastest first paint, lowest cost. If content varies by user or request (e-commerce product pages, social feeds), you need SSR: the server renders on every request. If you do not need SEO and can accept a blank loading screen (admin dashboards), CSR is the simplest.
>
> Nuxt 3 supports hybrid rendering (`routeRules`): different routes can use different strategies, for example SSR for the home page, SSG for docs, CSR for the admin area. That is currently the most flexible option.

### 2. What pitfalls cause hydrate to fail?

Answer template:

> Four common pitfalls. First, time-related: `Date.now()` on the server differs from the client, so the HTML does not match. Fix: fetch the time on the server and pass it to the client through state.
>
> Second, client-only APIs: the server has no `window / document`. If you call them in setup, the server either errors or renders empty, while the client renders something else. Fix: use `onMounted` or `<ClientOnly>`.
>
> Third, async data out of sync: the server fetched data but did not serialize it into `__INITIAL_STATE__`, so the client has no data during hydrate and renders differently. Fix: use Nuxt’s `useFetch` / `useAsyncData`, which handle this automatically.
>
> Fourth, random values: `Math.random()` / `uuid()` differ every time. Fix: generate them on the server and serialize them for the client to reuse.

## 8-Minute Recording Sequence (Vue Topic Summary)

1. Reactivity (Proxy / track-trigger / three-layer dependency collection) (2 minutes)
2. Compiler optimizations (Patch Flag / Block Tree / static hoisting) (2 minutes)
3. Rendering + diff (renderer / three-phase children diff / LIS) (1.5 minutes)
4. Component scheduling (setupRenderEffect / shouldUpdateComponent / nextTick) (1 minute)
5. Ecosystem (Router three modes + guards / Pinia state layering / SSR hydrate) (1.5 minutes)

## Today's Review

The 3 Vue questions most likely to break you:

1. “How do Patch Flag and Block Tree actually optimize diff?” — you need to draw a comparison and clearly explain dynamicChildren.
2. “What is the difference between Vue 3 diff and React diff?” — LIS vs single-direction traversal + Fiber.
3. “How do you debug a failed SSR hydrate?” — you need concrete scenarios and fixes, not vague talk.

3 new “why” questions this week:

1. Why can Vue 3 compiler optimizations reduce diff from O(n) to O(number of dynamic nodes)?
2. Why does Pinia not need mutations? (the reactivity system already tracks changes)
3. Why does SSR hydrate reuse the DOM instead of rebuilding it? (avoid first-paint flicker + fewer DOM operations)
