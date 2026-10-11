# Day 3 Async Model and Event Loop

## Goals

- Finish `/en/jscore/basic/event-loop`, `/en/jscore/basic/async-program`, `/en/jscore/advanced/promise`, `/en/jscore/advanced/async-await`
- Handwrite the Promise core (state machine + `then` chain + value penetration)
- Draw one macrotask / microtask execution-order diagram

## Read in order

1. [Event Loop](../jscore/basic/event-loop)
2. [Async Programming](../jscore/basic/async-program)
3. [Promise](../jscore/advanced/promise)
4. [async/await](../jscore/advanced/async-await)

## Practice and self-check

**Checkpoints**

- Code after `await` is scheduled as a **microtask**, not as blocking sync work
- `setTimeout(fn, 0)` ≠ run immediately: wait until sync code and microtasks are drained, and repeated nested timers may be clamped to at least 4ms
- `Promise.resolve().then` enqueues one microtask; nesting enqueues again

**Produce or redraw from memory**

- Predict the output of `console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4')`, then draw the task and microtask queue. [Check the event-loop explanation](../jscore/basic/event-loop#event-loop)
- Explain Promise states, value pass-through, and how `then` returns a new Promise. [Check the Promise chapter](../jscore/advanced/promise#_4-handwrite-a-promise)
- Implement the core Promise state machine, callback queue, and `then` chaining from memory. [Check the implementation](../handwrite/promise#core-skeleton)
- Explain when `await` yields and compare independent serial and parallel requests. [Check async/await](../jscore/advanced/async-await#_4-common-pitfall-serial-vs-parallel)

**Answer aloud without reading a reference answer**

- 1. Why does code after `await` look "synchronous"?
- 2. When do you use `Promise.all` vs `allSettled`?
- 3. What is “value penetration”, and when does it happen?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Event-loop stages: call stack → microtasks → render → macrotasks (2 minutes)
2. Promise state machine + then chain + value penetration (2 minutes)
3. async/await equivalent expansion (1 minute)

Self-check after recording:

- Did you say microtasks have higher priority than macrotasks?
- Did you say the difference between `queueMicrotask` and `setTimeout`?
- Did you say the three Promise states (pending / fulfilled / rejected) and their transitions?
- Did you say `await` “yields” rather than “blocks”?

## Recap

The 3 points that most need follow-up today:

1. The difference between manually enqueueing a microtask with `queueMicrotask` and enqueueing via `Promise.then`.
2. Where `requestAnimationFrame` sits in the event loop (before a rendering opportunity; it is a rendering callback, not a task).
3. An `async` function’s return value is always a Promise, but `return await` vs a plain `return` behave differently.
