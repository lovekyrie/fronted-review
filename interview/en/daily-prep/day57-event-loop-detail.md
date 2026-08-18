# Day 57 Event Loop Details Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 57 | Event loop details | [Event Loop](../jscore/basic/event-loop), [Performance Optimization](../advanced/week6/performance-optimization) |

## Today's Goals

- Finish the MDN Microtasks Guide + the HTML spec event-loop chapter
- Output an "inside one frame" execution sequence diagram (JS task → microtask → rAF → style/layout/paint)
- Be able to explain the timing differences among `queueMicrotask / setTimeout / requestAnimationFrame / requestIdleCallback`

## Reading Checkpoints

- Microtasks flush immediately after the JS call stack is empty each time, without waiting for the next macrotask
- `rAF` is "before the next frame paints", not "once every 16ms"
- `rIC` only runs when the browser is truly idle; it is not guaranteed to be called

## Cheat Sheet / Knowledge Points

### Execution sequence inside one event-loop frame

```text
1. Take one Task (macrotask): setTimeout / setInterval / I/O / UI event
2. Execute that Task
3. Drain the Microtask Queue: Promise.then / queueMicrotask / MutationObserver
4. (If rendering is needed):
   a. Run requestAnimationFrame callbacks
   b. Style calculation
   c. Layout
   d. Paint
   e. Composite
5. If there is idle time → run requestIdleCallback
6. Go back to 1
```

### Timing comparison of four async APIs

| API | Queue | Timing | Guaranteed to run |
|-----|------|------|----------|
| `queueMicrotask` | Microtask | Immediately after the current JS stack is empty | ✅ |
| `setTimeout(fn, 0)` | Macrotask | Next event-loop turn (minimum 4ms) | ✅ |
| `requestAnimationFrame` | rAF queue | Before the next frame paints | ✅ (when the page is visible) |
| `requestIdleCallback` | Idle queue | When the browser is idle | ❌ Not guaranteed |

### Key microtask rules

- Microtasks flush immediately **after the JS call stack is empty each time**, without waiting for the next macrotask.
- New microtasks produced inside a microtask are processed in **the same round** (this can cause an infinite loop that blocks).
- `async/await` is essentially Promise; code after await is equivalent to a `.then` callback.

### Node.js differences

| Phase | Callbacks |
|------|------|
| timers | setTimeout / setInterval |
| poll | I/O |
| check | setImmediate |
| Between every phase | process.nextTick → Promise microtasks |

## Handwritten / Flowcharts

### Classic output question

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
Promise.resolve().then(() => {
  console.log('4')
  setTimeout(() => console.log('5'), 0)
})
console.log('6')

// Output order: 1 → 6 → 3 → 4 → 2 → 5
// Explanation: sync(1,6) → microtasks(3,4) → macrotask(2) → macrotask(5)
```

### Interaction of rAF + microtasks

```js
requestAnimationFrame(() => {
  console.log('rAF')
  Promise.resolve().then(() => console.log('micro in rAF'))
})
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('micro'))

// Possible output: micro → timeout → rAF → micro in rAF
// (rAF runs in the rendering phase, usually later than timeout)
```

## Oral Questions

### 1. Execution order of `Promise.then` vs `setTimeout(fn, 0)`?

Answer template:

> `Promise.then` is a microtask; `setTimeout(fn, 0)` is a macrotask. In the event loop, after each macrotask finishes, all microtasks are drained. So the `Promise.then` callback always runs after the current macrotask ends and before the next macrotask, faster than `setTimeout`.
>
> Concretely: sync code finishes → drain the microtask queue (Promise.then) → take the next macrotask (setTimeout). If a microtask produces new microtasks, those are also drained in the same round, and only then is setTimeout taken.

### 2. What is `rAF` good for, and what is it not good for?

Answer template:

> rAF is good for **animation and DOM reads/writes**. It guarantees the callback runs before the browser's next paint, in sync with the screen refresh rate (usually 60fps = 16.6ms per frame). Animating with rAF avoids dropped frames or over-rendering.
>
> It is not good for two things. First, it is not good for long computation — if an rAF callback runs too long, it blocks rendering and causes dropped frames. Long computation should use `requestIdleCallback` or a Web Worker. Second, it is not good for "run as soon as possible" work — it is not guaranteed to run in the current frame and may wait until the next frame. If you only want async execution, use a microtask or setTimeout.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Full steps of one event-loop frame (Task → microtask → rAF → render → rIC) (1.5 minutes)
2. Timing comparison of the four async APIs + the classic output question (2 minutes)
3. rAF / rIC use cases + Node.js differences (1.5 minutes)

Self-check after recording:

- Did you state that microtasks flush immediately after the JS stack is empty each time.
- Did you state that rAF runs before rendering.
- Did you state that rIC is not guaranteed to be called.
- Can you compute the classic output question orally.

## Today's Review

The 3 points that most need follow-up today:

1. The microtask nature of `MutationObserver` (batch DOM changes, notify once).
2. Differences between Node.js `process.nextTick` and browser microtasks.
3. How `MessageChannel` is used in the React scheduler (replacing setTimeout for more precise task slicing).
