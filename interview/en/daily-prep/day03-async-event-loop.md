# Day 3 Async Model and Event Loop Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 3 | Async and the event loop | [Event Loop](../jscore/basic/event-loop), [Async Programming](../jscore/basic/async-program), [Promise](../jscore/advanced/promise), [async/await](../jscore/advanced/async-await) |

## Today's goals

- Finish `/en/jscore/basic/event-loop`, `/en/jscore/basic/async-program`, `/en/jscore/advanced/promise`, `/en/jscore/advanced/async-await`
- Handwrite the Promise core (state machine + `then` chain + value penetration)
- Draw one macrotask / microtask execution-order diagram

## Reading checkpoints

- Code after `await` is scheduled as a **microtask**, not as blocking sync work
- `setTimeout(fn, 0)` ≠ run immediately: wait until sync code and microtasks are drained, and the HTML spec clamps nested timeouts of depth ≥ 5 to at least 4ms
- `Promise.resolve().then` enqueues one microtask; nesting enqueues again

## Cheat sheet / knowledge points

### Event loop in three stages

Event-loop order:

```text
1. Call stack (sync code)
2. Microtask queue (Promise.then / await / queueMicrotask / MutationObserver)
3. (Optional) render pipeline: rAF -> Style -> Layout -> Paint
4. Macrotask queue (setTimeout / setInterval / I/O / MessageChannel)
```

After each macrotask, the loop checks the microtask queue again. If it is not empty, it runs all microtasks first, then takes the next macrotask.

**Microtasks have much higher priority than macrotasks.** That is the core of JS async.

### Macrotask / microtask classification

| Macrotasks | Microtasks |
|--------|--------|
| `setTimeout` | `Promise.then / catch / finally` |
| `setInterval` | `queueMicrotask` |
| `MessageChannel / postMessage` | `MutationObserver` |
| I/O, UI event callbacks | `process.nextTick` (Node; higher priority than Promise) |

> Note: **`UI render` is not a macrotask**. It is an independent phase the browser may run after “one macrotask + all microtasks” have finished.
>
> **`requestAnimationFrame` is strictly neither a macrotask nor a microtask.** It is an independent rAF callback queue, run before each frame’s render and before style calculation, synced to the screen refresh rate (usually 60fps).

### A common execution-order question

```js
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
})

console.log('5')

// Correct answer: 1 → 5 → 4 → 2 → 3
// Breakdown:
// 1. Sync code: 1, 5
// 2. Microtask: 4
// 3. First macrotask (setTimeout): 2; after printing 2, microtask 3 is created
// 4. Run microtasks: 3
```

### Promise three states

A Promise has three states:

- **`pending`**: initial state; can become `fulfilled` or `rejected`
- **`fulfilled`**: the operation succeeded; `onFulfilled` is called
- **`rejected`**: the operation failed; `onRejected` is called

**State changes are one-way and irreversible**: pending → fulfilled or pending → rejected. Once settled, the state cannot change again.

### Value penetration

**Value penetration means: `then / catch` expect a function. If the argument is not a function (a number, a string, `null`, etc.), that `then` is skipped, and the previous Promise’s value jumps over it to the next `then`.**

```js
Promise.resolve(1)
  .then(2)              // not a function: value penetration
  .then(null)           // not a function: keep penetrating
  .then(console.log)    // logs 1, not 2
```

Implementation key (shown in the handwritten Promise later):

```js
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
```

Do not confuse “value penetration” with ordinary chained return passing. The following is not value penetration; the `then` callback simply returns a normal value:

```js
Promise.resolve(1)
  .then(res => res * 2)      // callback is a function, returns 2
  .then(res => res + 1)      // callback is a function, returns 3
  .then(console.log)         // prints 3
```

If the callback returns a Promise, the next `then` waits for it to resolve:

```js
Promise.resolve(1)
  .then(res => Promise.resolve(res * 2))  // returns Promise<2>
  .then(console.log)                      // prints 2
```

### async/await equivalent expansion

An `async` function is a function that returns a Promise; `await` is syntactic sugar for waiting on Promise resolve:

```js
// async function
async function fetchData() {
  const data = await fetch('/api')
  return data
}

// equivalent expansion
function fetchData() {
  return fetch('/api')
    .then(data => data)
}
```

### Common misunderstandings

1. **`await` is not blocking**: it only yields; subsequent code is registered as a microtask, and sync code keeps running.
2. **`setTimeout(fn, 0)` does not guarantee immediate execution**: it only gets a chance after sync code and all microtasks finish; and the HTML spec clamps nested `setTimeout` of depth ≥ 5 to at least 4ms, so deep nesting gets slower and slower.
3. **Nested `Promise.resolve().then`**: each `.then` creates a new microtask; they are not run continuously inside the same microtask.

## Handwritten notes / flowcharts

### Handwritten Promise core skeleton: state, then chain, value penetration

> Note: this is an interview-acceptable “core skeleton”. It does not implement Promises/A+ `resolvePromise` (thenable resolution). If `onFulfilled` returns a Promise / thenable, a strict implementation must call `x.then(resolve, reject)` to follow its state, and also check for circular references. If you are asked follow-up questions, you need to add that.

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }

    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = reason
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // Value penetration: if not a function, pass the value through
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    const promise = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.state === 'rejected') {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.value)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })
      } else {
        // pending: collect callbacks first
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onFulfilled(this.value)
              resolve(result)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onRejected(this.value)
              resolve(result)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}
```

### Macrotask / microtask execution-order diagram

```text
┌─────────────────────────────────────────────────┐
│              Call stack (sync code)             │
│  console.log('1')                                │
│  console.log('5')                                │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Microtask queue (all Promise.then / await)     │
│  1. microtask: () => console.log('4')           │
│  2. microtask: () => console.log('3') (enters   │
│     after setTimeout fires)                     │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Macrotask queue (setTimeout / setInterval / I/O)│
│  1. macrotask: () => { console.log('2');        │
│                 microtask 3 }                   │
└─────────────────────────────────────────────────┘

Output order: 1 → 5 → 4 → 2 → 3
```

## Oral questions

### 1. Why does code after `await` look "synchronous"?

Answer template:

> Code after `await` looks synchronous because it is wrapped as a Promise `.then` callback. Microtasks run after the current macrotask ends and after all sync code has finished, so it feels like a synchronous wait. In reality `await` only yields; sync code keeps going, and the code after `await` runs when the microtask queue reaches it.
>
> The key is to distinguish “yielding” from “blocking”. `await` does not block sync code; it only registers the rest as a microtask. Only after all sync code in the current macrotask has finished does the microtask queue run, and only then does the code after `await` start.
>
> Example: `await fetch('/api')` does not freeze the main thread. The `fetch` request goes out while sync code continues; only the code after `fetch` is queued as a microtask and runs after `fetch` resolves.

### 2. When do you use `Promise.all` vs `allSettled`?

Answer template:

> `Promise.all` is “all must succeed”. One rejection rejects the whole Promise. Use it when independent parallel tasks all need to succeed before you continue.
>
> `Promise.allSettled` is “wait for all, success or failure”. Every Promise’s result is kept, fulfilled or rejected. Use it when you need every result and a partial failure should not abort the rest.
>
> Concrete example: sending several requests, **continue only if every one succeeded** → `all`; **you need every result regardless of success or failure** (e.g. a page loads several components, and one failing should not hide the others) → `allSettled`.

### 3. What is “value penetration”, and when does it happen?

Answer template:

> Value penetration is an easy-to-misread point in Promise chains. It means: `then` and `catch` expect a function. If you pass something that is not a function — a number, a string, `null` — that `then` is skipped, and the previous Promise’s value jumps over it to the next `then`.
>
> The standard example is `Promise.resolve(1).then(2).then(null).then(console.log)`, which logs `1`, not `2`, because neither `2` nor `null` is a function, so value penetration happens.
>
> Implementation is basically one line: in `then`, if `onFulfilled` is not a function, default it to `v => v`; if `onRejected` is not a function, default it to `e => { throw e }`.
>
> Distinguish this from “chained return passing”: `then(res => res * 2)` is a callback returning a normal value. That is not value penetration, just normal chaining.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Event-loop stages: call stack → microtasks → render → macrotasks (2 minutes)
2. Promise state machine + then chain + value penetration (2 minutes)
3. async/await equivalent expansion (1 minute)

Self-check after recording:

- Did you say microtasks have higher priority than macrotasks?
- Did you say the difference between `queueMicrotask` and `setTimeout`?
- Did you say the three Promise states (pending / fulfilled / rejected) and their transitions?
- Did you say `await` “yields” rather than “blocks”?

## Today's review

The 3 points that most need follow-up today:

1. The difference between manually enqueueing a microtask with `queueMicrotask` and enqueueing via `Promise.then`.
2. Where `requestAnimationFrame` sits in the event loop (before each frame’s render; it is a macrotask).
3. An `async` function’s return value is always a Promise, but `return await` vs a plain `return` behave differently.
