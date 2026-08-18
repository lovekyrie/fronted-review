# Day 31 Vue Scheduler and Async Updates Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 31 | scheduler | [Reactivity](../advanced/week3/reactivity), [Rendering mechanism](../advanced/week3/rendering-mechanism) |

## Today's goals

- Read Vue source `runtime-core/src/scheduler.ts`
- Draw a sequence diagram of “change state 3 times synchronously → trigger only one component update”
- Write up the relationship among `queueJob / queuePostFlushCb / nextTick`

## Reading checkpoints

- Vue’s async updates are merged with **microtasks**, so `nextTick` can see the latest DOM
- Component jobs are sorted by id; the parent updates first, so a child is not rendered and then unmounted by the parent
- `flushPostFlushCbs` corresponds to the `flush: 'post'` timing of `watchEffect`

## Cheat sheet / knowledge points

- Reactive `trigger` happens synchronously, but component DOM updates usually enter the scheduler queue and run asynchronously in batches.
- The scheduler’s core value is merging multiple state changes in the same event-loop turn, so intermediate states do not repeatedly render and patch.
- `queueJob` puts a component update job into the queue and uses deduplication so the same job runs only once in a single flush.
- Vue flushes via a microtask; a common mental model is `Promise.resolve().then(flushJobs)`.
- Component update jobs are sorted by id. Parents are usually created first and have smaller ids, so parents update first; that avoids a child updating and then being unmounted by the parent.
- `nextTick` waits for the promise of the current scheduler flush, so after `await nextTick()` you can usually read the patched DOM.
- `flush: 'pre'` watchers run before the component DOM update, which fits pre-update side effects based on state.
- `flush: 'post'` watchers run after the component DOM update, which fits reading the updated DOM.
- `flush: 'sync'` runs synchronously and skips the batch queue. It fits rare cases that need an immediate reaction, but it easily causes repeated triggers.
- The scheduler does not make reactivity itself asynchronous; it makes “side-effect execution / component updates” schedulable.

## Hands-on / flowcharts

```text
setState × 3 → queueJob dedupe → microtask flush → run job → flushPost → nextTick resolves
```

```js
const queue = []
let isFlushing = false
let currentFlushPromise

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (isFlushing) return
  currentFlushPromise = Promise.resolve().then(flushJobs)
}

function flushJobs() {
  isFlushing = true
  queue.sort((a, b) => a.id - b.id)

  try {
    for (const job of queue) job()
  }
  finally {
    queue.length = 0
    isFlushing = false
    currentFlushPromise = null
  }
}

function nextTick(fn) {
  const p = currentFlushPromise || Promise.resolve()
  return fn ? p.then(fn) : p
}
```

```text
count.value++
count.value++
count.value++
  -> trigger 3 times
  -> queueJob(renderEffect) 3 times
  -> queue keeps only 1 component update job
  -> this turn of sync code ends
  -> microtask flushJobs
  -> render -> patch DOM
  -> after await nextTick(), read the latest DOM
```

## Oral questions

### 1. Why can Vue’s `nextTick` see the latest DOM?

> Answer template: In Vue, changing reactive data synchronously triggers dependencies, but the component does not patch the DOM on every change. It puts the component’s render effect into the scheduler queue and flushes the batch in the same microtask. `nextTick` essentially waits for the promise of that flush. If you change state three times in sync code, the DOM is not updated three times immediately; the queue is deduped and render plus patch run together in the microtask. So after `await nextTick()`, the current batch of component updates has finished, and you can usually read the latest DOM.

### 2. How is parent/child update order guaranteed?

> Answer template: Vue wraps a component update as a job in the scheduler queue. Jobs usually carry the id assigned when the component was created. Parents are typically created first and have smaller ids; sorting the queue by id before flush makes the parent update before the child. That has two benefits: first, a parent update may decide whether the child still exists, so updating the parent first avoids wasted child work; second, props from parent to child are settled first, then the child updates from the latest input. This order is not “run recursively immediately”; it is guaranteed by scheduler queuing and sorting.

## 5-minute recording outline

1. Scheduler enqueue and dedupe (1.5 minutes)
2. Microtask flush timing (2 minutes)
3. Meaning of pre / sync / post (1.5 minutes)

## Today's review

1. Most likely follow-up: `nextTick` does not “make data update”; the data is already updated. It waits for the DOM patch to finish.
2. Current gap: map `pre / sync / post` watcher timing to real scenarios, especially reading the DOM in post.
3. Next follow-up: connect to Day 32 and explain how `ref/reactive/computed/watch` work on this reactivity and scheduling system.
