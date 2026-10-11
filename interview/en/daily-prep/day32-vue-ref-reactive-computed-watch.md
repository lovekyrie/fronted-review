# Day 32 ref / reactive / computed / watch

## Goals

- Finish the Vue Computed / Watchers docs
- Produce a comparison table of the 4 APIs: usage, reactivity boundary, common pitfalls
- Hand-write a minimal `ref` + `computed`

## Read in order

1. [Reactivity](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- `ref` is an object wrapper with `.value`; destructuring drops reactivity. `reactive` also drops reactivity when destructured; use `toRefs`
- `computed` is lazy: it only runs when accessed, and it caches the result
- What `watch` options `immediate / deep / flush` each solve

**Produce or redraw from memory**

- 4-API comparison table — [reference section](../advanced/week3/reactivity#day-32-4-api-comparison-table)
- 3 typical ways reactivity is lost — [reference section](../advanced/week3/reactivity#day-32-3-typical-ways-reactivity-is-lost)
- Supplementary notes — [reference section](../advanced/week3/reactivity#day-32-supplementary-notes)

**Answer aloud without reading a reference answer**

- 1. How do you choose between `ref` and `reactive`?
- 2. How do you choose between `computed` and `watch`?

**Recording drill**

1. Usage boundaries of the 4 APIs (2 minutes)
2. 3 ways reactivity is lost (1.5 minutes)
3. computed lazy evaluation + cache (1.5 minutes)

## Recap

1. Most likely follow-up: `computed` is not ordinary function memoization; it is a lazy effect + dirty flag + exposing a `.value` dependency.
2. Current gap: `watchEffect` auto-deps only cover the synchronous phase; dependencies after async `await` should not rely on implicit tracking.
3. Next follow-up: connect to Day 33 and put these APIs back into the Vue 2 vs Vue 3 reactivity architecture comparison.
