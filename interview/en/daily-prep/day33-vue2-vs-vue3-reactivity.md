# Day 33 Vue 2 vs Vue 3 Reactivity

## Goals

- Compare Vue 2 `Observer / Dep / Watcher` with Vue 3 `reactive / dep / effect` architecture
- Produce a migration FAQ list (arrays / added properties / Set Map support / when deep reactivity happens / performance)
- Be able to explain why Vue 2 has `Vue.set` and why Vue 3 does not need it

## Read in order

1. [Reactivity](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- Two limits of Vue 2 `Object.defineProperty`: cannot observe add/delete, cannot observe array indexes
- Vue 2 rewrites 7 array methods to work around the index problem; Vue 3 supports this naturally with Proxy
- Vue 3 reactivity is created **on demand** (lazy proxy), which is friendlier to large objects

**Produce or redraw from memory**

- Vue 2 vs Vue 3 reactivity role mapping — [reference section](../advanced/week3/reactivity#day-33-vue-2-vs-vue-3-reactivity-role-mapping)
- Supplementary notes — [reference section](../advanced/week3/reactivity#day-33-supplementary-notes)

**Answer aloud without reading a reference answer**

- 1. What concrete problems does Vue 3 reactivity solve compared with Vue 2?
- 2. Why did Vue 2 have `Vue.set` / `$set`?

**Recording drill**

1. Vue 2 reactivity architecture (2 minutes)
2. Vue 2 pain points (1.5 minutes)
3. How Vue 3 solves them (1.5 minutes)

## Recap

1. Most likely follow-up: Vue 3 is not simply “faster than Vue 2”; the set of interceptable operations is more complete, and the architecture is more unified.
2. Current gap: for arrays, do not only say Proxy supports them naturally; know that Vue still special-cases array methods, length, and index dependencies.
3. Next follow-up: connect to Day 34, enter template compilation, and explain the render function and vnode chain after reactivity triggers.
