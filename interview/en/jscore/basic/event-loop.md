---
title: Event Loop and Task Scheduling
description: A deep dive into the JavaScript event loop, Node.js phases, where requestAnimationFrame sits, and microtask priority
---

### Event Loop
JavaScript is single-threaded and uses the event loop for asynchrony.

#### Call Stack
The data structure the JS engine uses to manage function calls.
- **LIFO**: last in, first out.
- **Synchronous**: code is pushed onto the stack line by line and popped when it finishes.
- **Single-threaded**: only the top-of-stack task runs at a time.

```js
function first() {
  console.log('first');
  second();
}

function second() {
  console.log('second');
  third();
}

function third() {
  console.log('third');
}

first();
// Output order: first, second, third
```

#### Task Queue
After an async task finishes, its callback waits in a task queue. There are two kinds:
- **Macro Task**: tasks initiated by the host (browser/Node).
- **Micro Task**: tasks initiated by the JS engine itself.

1. **Macro tasks**
   - `setTimeout` / `setInterval`
   - `setImmediate` (Node)
   - `requestAnimationFrame` (browser)
   - I/O (file I/O, network)
   - UI rendering

2. **Micro tasks**
   - `Promise.then/catch/finally`
   - `process.nextTick` (Node, highest priority)
   - `MutationObserver`
   - `queueMicrotask`

#### Event Loop process
This is the core of JS asynchrony.
1. **Synchronous code**: run top to bottom, push onto the call stack, then clear it.
2. **Drain microtasks**: when the call stack is empty, run **all** tasks in the microtask queue.
3. **Render UI**: (browser) a paint may happen here.
4. **Run one macrotask**: take **one** task from the macrotask queue.
5. **Loop**: go back to step 2.

**Mnemonic**: sync -> microtasks (all) -> render -> macrotask (one) -> microtasks (all) ...

```js
console.log('1'); // sync

setTimeout(() => {
  console.log('2'); // macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // microtask
});

console.log('4'); // sync

// Output order: 1, 4, 3, 2
```

#### Common interview questions
1. **async/await execution order**
   - Code after `await` is like `Promise.then` — a microtask.
   - The expression on the right of `await` on the same line runs synchronously.

```js
async function async1() {
  console.log('1');
  await async2(); // async2() runs synchronously
  console.log('2'); // microtask
}

async function async2() {
  console.log('3');
}

console.log('4');
async1();
console.log('5');

// Output order: 4, 1, 3, 5, 2
```

2. **Nested Promise**
   - The inner `then` is registered first; the outer follow-up `then` is also a microtask, but when it is registered depends on when the promise settles.

```js
Promise.resolve().then(() => {
  console.log('1');
  return Promise.resolve().then(() => {
    console.log('2');
  });
}).then(() => {
  console.log('3');
});

// Output order: 1, 2, 3
```

3. **process.nextTick in Node.js**
   - Its priority is **higher** than Promise.
   - After the current phase's sync code finishes, nextTick runs immediately, then Promise microtasks.

```js
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// Output: nextTick -> Promise
```

#### Browser vs Node.js
- **Browser**: the microtask queue is drained after every macrotask.
- **Node 11+**: behavior converges with the browser.
- **Node 10 and below**: microtasks were drained only after each phase (Timer, I/O, ...). That model is obsolete; interviews usually expect the current standard.

```js
// Node.js environment
setImmediate(() => {
  console.log('1');
});

setTimeout(() => {
  console.log('2');
}, 0);

// Output order: random. Depends on Node startup cost and init time.
```

#### Best practices
1. **Avoid long synchronous work**: it blocks the event loop and janks the page. Offload heavy computation to `Web Workers`.
2. **Know microtask priority**: `Promise` and `MutationObserver` run before `setTimeout`, so they fit high-priority data updates.
3. **Don't overuse timers**: `setTimeout` has a minimum delay (4ms) and is a poor high-precision clock. Use `requestAnimationFrame` for animation.

---

## High-frequency follow-ups and deeper principles

### Node.js phases (the libuv event loop)

Node.js's event loop has multiple **phases**, each handling a specific kind of work:

```
┌───────────────────────┐
│        timers         │  Run setTimeout/setInterval callbacks
│   (Phase 1: timers)   │
└───────────────────────┘
         ↓
┌───────────────────────┐
│  pending callbacks    │  I/O callbacks deferred to the next loop
│   (pending callbacks) │
└───────────────────────┘
         ↓
┌───────────────────────┐
│    idle, prepare      │  Internal use
└───────────────────────┘
         ↓
┌───────────────────────┐
│        poll           │  Fetch new I/O events (network, files, etc.)
│   (poll phase)        │  Run callbacks if the queue is non-empty; otherwise block
└───────────────────────┘
         ↓
┌───────────────────────┐
│        check          │  Run setImmediate callbacks
│   (check phase)       │
└───────────────────────┘
         ↓
┌───────────────────────┐
│   close callbacks     │  Run close callbacks (e.g. socket.on('close'))
│   (close callbacks)   │
└───────────────────────┘
```

#### Typical work in each phase

| Phase | Work | Typical APIs |
|------|------|----------|
| timers | Timer callbacks | `setTimeout`, `setInterval` |
| pending callbacks | System error callbacks | failed `fs.rename` callback |
| poll | I/O polling | `fs.readFile`, `net.socket` |
| check | Immediate callbacks | `setImmediate` |
| close | Close callbacks | `socket.on('close')` |

#### When microtasks run in Node.js

```js
// In Node.js, microtasks run after each phase, not after each macrotask

// Phase: timers
setTimeout(() => console.log('timeout'))

// Phase: check (after timers)
setImmediate(() => console.log('immediate'))

// Output order (timers vs setImmediate):
// If timeout is queued before check: timeout -> immediate
// If poll becomes empty and check has callbacks: setImmediate runs first
// Conclusion: it depends on the current event-loop state
```

#### Advanced: why not do heavy work inside timers

```js
// Bad: long computation blocks the timers phase
setInterval(() => {
  heavyCpuTask() // assume CPU-heavy
}, 1000)

// Better: requestIdleCallback or chunking
function chunkedTask(tasks, callback) {
  let index = 0
  function step(deadline) {
    while (index < tasks.length && deadline.timeRemaining() > 0) {
      tasks[index++]()
    }
    if (index < tasks.length) {
      requestIdleCallback(step)
    } else {
      callback()
    }
  }
  requestIdleCallback(step)
}
```

---

### Where requestAnimationFrame sits in the event loop

`requestAnimationFrame` (RAF) has a special place in the browser event loop:

#### When RAF runs

```
┌─────────────────────────────────────────┐
│            Call Stack                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Microtask queue                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Rendering                       │ ← here!
│    - style recalc                        │
│    - layout                              │
│    - paint                               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              Macrotasks                  │
└─────────────────────────────────────────┘
```

**RAF callbacks run before rendering**, which is why they are a good fit for animation.

#### RAF vs setTimeout(16ms) for animation

```js
// setTimeout approach
let lastTime = 0
function animate(time) {
  if (time - lastTime >= 16) { // ~60fps
    lastTime = time
    // animation logic
  }
  setTimeout(() => animate(performance.now()), 16)
}

// RAF approach (recommended)
function animate() {
  // The browser targets 60fps and calls this before paint
  requestAnimationFrame(animate)
}
```

| Dimension | setTimeout | RAF |
|------|-----------|-----|
| Precision | Unstable, can drop frames | Stable 60fps |
| Throttling | Manual time-delta | Automatic |
| Hidden tab | Keeps running | Pauses (saves CPU) |
| Mobile power saving | No | Yes |

---

### When to use queueMicrotask

`queueMicrotask` queues a callback as a microtask, at a lower level than `Promise.then`:

```js
// Scenario 1: run after the current microtask queue is drained
queueMicrotask(() => {
  console.log('microtask')
})

// Scenario 2: a lighter alternative to MutationObserver for simple DOM readiness
// (no Observer instance needed)
function whenElementReady(selector, callback) {
  const el = document.querySelector(selector)
  if (el) {
    callback(el)
  } else {
    queueMicrotask(() => whenElementReady(selector, callback))
  }
}

// Scenario 3: avoid Promise.then overhead
// Promise.then creates 3 Promises (resolve/reject wrapping)
// queueMicrotask is lighter
queueMicrotask(() => {
  // Run directly, no extra overhead
  syncData()
})
```

---

### Full browser vs Node.js event-loop differences

| Dimension | Browser | Node.js |
|------|--------|---------|
| Rendering | Yes (may paint each tick) | No (no UI) |
| Phases | No (simple loop) | Multiple phases (timers/poll/check/close) |
| Microtask timing | After each macrotask | After each phase |
| setImmediate | No | Yes |
| process.nextTick | No | Yes (higher than Promise) |
| queueMicrotask | Yes | Yes |

#### Node.js microtask priority

```js
process.nextTick(() => console.log('1')) // highest
queueMicrotask(() => console.log('2'))   // next
Promise.resolve().then(() => console.log('3')) // last
// Output: 1 -> 2 -> 3
```

#### Browser microtasks

```js
queueMicrotask(() => console.log('1'))
Promise.resolve().then(() => console.log('2'))
// Output: 1 -> 2 (both are microtasks, FIFO)
```

---

## Interview answer template

**Question**: How does the JavaScript event loop work?

**High-scoring answer**:

> JavaScript is single-threaded and implements asynchrony with the event loop:
>
> 1. The **call stack** runs synchronous code
> 2. After the stack is empty, the **microtask queue** is fully drained (Promise, queueMicrotask, MutationObserver)
> 3. In the browser, a **render** may run
> 4. Take one task from the **macrotask queue** (setTimeout, setInterval, I/O, RAF)
> 5. Go back to step 2
>
> Key point: **all microtasks are drained after every macrotask**, so `Promise.then` runs before `setTimeout`.
>
> Node.js has multiple phases (timers/poll/check). Microtasks run after each phase. `process.nextTick` has higher priority than Promise.

---

## Related links

- [Node.js event loop docs](https://nodejs.org/en/guides/event-loop-timers-and-nexttick)
- [MDN concurrency model](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)
- [Jake Archibald's event loop article](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
