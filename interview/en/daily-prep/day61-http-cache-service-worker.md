# Day 61 HTTP cache + Service Worker execution log

## Goals

- Finish MDN HTTP Caching + Service Worker API
- Draw a request chain: “browser → Service Worker → HTTP cache → network”
- Write up the three common Service Worker strategies: Cache First / Network First / Stale While Revalidate

## Read in order

1. [Caching](../network&broswer/cache-mechanism)
2. [Browser storage](../network&broswer/broswer-storage)

## Practice and self-check

**Checkpoints**

- A SW is a request proxy: it can intercept fetch and decide whether to go to the network or the Cache API
- SW update flow: install → waiting → activate; a hard refresh does not replace the old SW immediately
- `Cache-Control: no-cache` is not “do not cache”; it means “revalidate every time”. `no-store` is the one that disables caching entirely

**Produce or redraw from memory**

- HTTP caching system — [reference section](../network&broswer/cache-mechanism#day-61-http-caching-system)
- Common Cache-Control values — [reference section](../network&broswer/cache-mechanism#day-61-common-cache-control-values)
- Best practice: split strategies for HTML vs static assets — [reference section](../network&broswer/cache-mechanism#day-61-best-practice-split-strategies-for-html-vs-static-assets)
- Service Worker lifecycle — [reference section](../network&broswer/cache-mechanism#day-61-service-worker-lifecycle)
- Three caching strategies — [reference section](../network&broswer/cache-mechanism#day-61-three-caching-strategies)
- Request chain — [reference section](../network&broswer/cache-mechanism#day-61-request-chain)
- Implementing the three strategies — [reference section](../network&broswer/cache-mechanism#day-61-implementing-the-three-strategies)

**Answer aloud without reading a reference answer**

- 1. How do you choose among the three common Service Worker cache strategies?
- 2. What is the difference between `no-cache` and `no-store`?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Request chain (browser → SW → HTTP cache → network) + strong cache vs negotiated cache (1.5 min)
2. SW lifecycle (install → waiting → activate) + skipWaiting/claim (2 min)
3. Three cache strategies (Cache First / Network First / SWR) + when to use each (1.5 min)

After recording, self-check:

- Did you say no-cache ≠ do not cache.
- Did you mention the SW waiting phase and skipWaiting.
- Did you name the resource types each of the three strategies fits.
- Did you say HTML uses no-cache + static assets use long-lived cache + hash.

## Recap

The 3 points that most need review today:

1. The `stale-while-revalidate` HTTP header (same name as the SW strategy, different layer).
2. The “wait for old pages to close” problem when a SW updates (and the risk of `skipWaiting`).
3. How the Cache API relates to the browser HTTP cache (two independent cache layers).
