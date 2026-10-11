# Day 31 Vue Scheduler and Async Updates

## Goals

- Read Vue source `runtime-core/src/scheduler.ts`
- Draw a sequence diagram of “change state 3 times synchronously → trigger only one component update”
- Write up the relationship among `queueJob / queuePostFlushCb / nextTick`

## Read in order

1. [Reactivity](../advanced/week3/reactivity)
2. [Rendering mechanism](../advanced/week3/rendering-mechanism)

## Practice and self-check

**Checkpoints**

- Vue’s async updates are merged with **microtasks**, so `nextTick` can see the latest DOM
- Component jobs are sorted by id; the parent updates first, so a child is not rendered and then unmounted by the parent
- `flushPostFlushCbs` corresponds to the `flush: 'post'` timing of `watchEffect`

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week3/reactivity#day-31-knowledge-notes)
- Practice example — [reference section](../advanced/week3/reactivity#day-31-practice-example)

**Answer aloud without reading a reference answer**

- 1. Why can Vue’s `nextTick` see the latest DOM?
- 2. How is parent/child update order guaranteed?

**Recording drill**

1. Scheduler enqueue and dedupe (1.5 minutes)
2. Microtask flush timing (2 minutes)
3. Meaning of pre / sync / post (1.5 minutes)

## Recap

1. Most likely follow-up: `nextTick` does not “make data update”; the data is already updated. It waits for the DOM patch to finish.
2. Current gap: map `pre / sync / post` watcher timing to real scenarios, especially reading the DOM in post.
3. Next follow-up: connect to Day 32 and explain how `ref/reactive/computed/watch` work on this reactivity and scheduling system.
