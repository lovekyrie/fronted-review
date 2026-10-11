# Day 57 Event Loop Details

## Goals

- Read the event-loop chapters on microtask checkpoints, rAF, and Node.js differences
- Output an "inside one frame" execution sequence diagram (JS task → microtask → rAF → style/layout/paint)
- Be able to explain the timing differences among `queueMicrotask / setTimeout / requestAnimationFrame / requestIdleCallback`

## Read in order

1. [Event Loop](../jscore/basic/event-loop)
2. [Performance Optimization](../advanced/week6/performance-optimization)

## Practice and self-check

**Checkpoints**

- At a microtask checkpoint, the browser drains the queue before moving to another task; microtasks queued during draining run in that checkpoint
- `rAF` is "before the next frame paints", not "once every 16ms"
- `rIC` only runs when the browser is truly idle; it is not guaranteed to be called

**Produce or redraw from memory**

- Draw a possible sequence of one task → microtask checkpoint → rendering opportunity → rAF → style/layout/paint. Explain why rendering can be skipped. [Check the rendering section](../jscore/basic/event-loop#where-requestanimationframe-sits-in-the-event-loop)
- Compare `queueMicrotask`, `setTimeout(0)`, `requestAnimationFrame`, and `requestIdleCallback` by queue and timing. [Check the event-loop chapter](../jscore/basic/event-loop#event-loop)
- Predict the order of `console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4')`. Then explain why a timer and rAF have no guaranteed relative order. [Check both examples](../jscore/basic/event-loop#event-loop-output-exercises).
- State one Node.js difference and one microtask-starvation risk. [Check the Node.js section](../jscore/basic/event-loop#node-js-phases-the-libuv-event-loop)

**Answer aloud without reading a reference answer**

- 1. Execution order of `Promise.then` vs `setTimeout(fn, 0)`?
- 2. What is `rAF` good for, and what is it not good for?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Full steps of one event-loop frame (Task → microtask → rAF → render → rIC) (1.5 minutes)
2. Timing comparison of the four async APIs + the classic output question (2 minutes)
3. rAF / rIC use cases + Node.js differences (1.5 minutes)

Self-check after recording:

- Did you state that microtasks drain at a checkpoint before the next task.
- Did you state that rAF runs before rendering.
- Did you state that rIC is not guaranteed to be called.
- Can you compute the classic output question orally.

## Recap

The 3 points that most need follow-up today:

1. The microtask nature of `MutationObserver` (batch DOM changes, notify once).
2. Differences between Node.js `process.nextTick` and browser microtasks.
3. How `MessageChannel` is used in the React scheduler (replacing setTimeout for more precise task slicing).
