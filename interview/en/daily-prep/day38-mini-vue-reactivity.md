# Day 38 Hand-writing mini-vue Reactivity

## Goals

- Create a mini-vue-reactivity directory under `hand-write/` in the repo (or update `vue-book/reactive-system`)
- Implement the five-piece set `reactive / ref / effect / computed / watch`
- Write 3 test cases: basic reactivity / nested effect / computed cache

## Read in order

1. [Reactivity](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- You must implement `effectStack` to handle nested effects
- `cleanup` is an optimization: remove yourself from deps before each run, then collect again
- `computed` uses a `dirty` flag + lazy evaluation, and visitors must be able to receive its trigger

**Produce or redraw from memory**

- Dependency collection data structure — [reference section](../advanced/week3/reactivity#day-38-dependency-collection-data-structure)
- Relationship of the five-piece set — [reference section](../advanced/week3/reactivity#day-38-relationship-of-the-five-piece-set)
- Implementation points — [reference section](../advanced/week3/reactivity#day-38-implementation-points)
- Core implementation of reactive + effect + computed — [reference section](../advanced/week3/reactivity#day-38-core-implementation-of-reactive-effect-computed)

**Answer aloud without reading a reference answer**

- 1. What pitfalls did you hit while hand-writing mini-vue?
- 2. Why do nested effects need a stack?

**Recording drill**

Record in this order; do not restructure on the fly:

1. Five-piece relationship diagram + data structure (WeakMap → Map → Set) (2 minutes)
2. Three pitfalls (nested effect / cleanup / computed dirty) (2 minutes)
3. Gap vs Vue source (scheduler priority / batching / ref unwrap) (1 minute)

Self-check after recording:

- Did you say the three-level WeakMap → Map → Set structure?
- Did you say effectStack solves nesting?
- Did you say cleanup solves stale deps from conditional branches?
- Did you say computed’s dirty + scheduler mechanism?

## Recap

Three points to fill in today:

1. How `ref` auto-unwrap is handled inside reactive.
2. Implementation differences of `watch` `immediate / flush: 'post'`.
3. Sorting in source `triggerEffects` (computed effects run first).
