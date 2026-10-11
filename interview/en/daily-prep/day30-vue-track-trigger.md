# Day 30 Vue track / trigger / effect

## Goals

- Read `@vue/reactivity` `effect.ts` (source or a mini implementation)
- Draw a full flow of dependency collection + triggering updates
- Produce a relationship diagram of `activeEffect / effectStack / targetMap / depsMap / dep`

## Read in order

1. [Reactivity](../advanced/week3/reactivity)

## Practice and self-check

**Checkpoints**

- `activeEffect` is a global. Nested effects need a **stack** to restore it
- `targetMap: WeakMap<object, depsMap>`, `depsMap: Map<key, dep>`, `dep: Set<effect>`
- `trigger` should copy the set to an array (or a new set) before iterating, so adding/removing effects during iteration does not infinite-loop

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week3/reactivity#day-30-knowledge-notes)
- Practice example — [reference section](../advanced/week3/reactivity#day-30-practice-example)

**Answer aloud without reading a reference answer**

- 1. Why is the dep-collection structure `WeakMap<obj, Map<key, Set<effect>>>`?
- 2. Why do nested effects need a stack?

**Recording drill**

1. track flow (2 minutes)
2. trigger flow (1.5 minutes)
3. effect stack + cleanup (1.5 minutes)

## Recap

1. Most likely follow-up: deps are not stored on the Proxy. They live in the global `targetMap`. Proxy is only the read/write intercept entry.
2. Current gap: be able to explain cleanup clearly, especially why old deps must be cleared when conditional-branch deps switch.
3. Next to add: connect to Day 31, and explain why a component update after trigger usually does not patch the DOM synchronously right away.
