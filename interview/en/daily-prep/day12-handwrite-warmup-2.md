# Day 12 Handwrite Warmup 2 (debounce / throttle / Promise / EventEmitter / promisify) Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 12 | Handwrite 2 (debounce/throttle/EventEmitter/promisify) | [debounce](../handwrite/debounce), [throttle](../handwrite/throttle), [event-emitter](../handwrite/event-emitter), [promisify](../handwrite/promisify) |

## Today's goals

- Finish `/en/handwrite/debounce`, `throttle`, `promisify`, `event-emitter`
- Produce a debounce / throttle comparison table (when they fire, leading/trailing options, cancel semantics)
- Produce oral templates for EventEmitter / promisify

## Reading checkpoints

- Debounce = wait a bit and only run the last call; throttle = run at a fixed frequency
- Common follow-ups: the edge case when `leading: true, trailing: true` are both on, and how to implement `cancel`
- EventEmitter's `once` is implemented with a wrapper plus removal
- `promisify` targets error-first callbacks; watch `this` binding

## Cheat sheet / knowledge points

### Debounce vs throttle

| Dimension | Debounce | Throttle |
|------|----------------|-----------------|
| Meaning | Wait a bit, only run the last call | Run at a fixed frequency |
| Typical use | Search-box input, window resize end | Scroll events, drag |
| Timing | Runs after triggering stops for `delay` | Runs at least once every `delay` |
| leading | Fire immediately on the first call | Fire immediately on the first call |
| trailing | Fire the last call after the delay | Fire the last call after the delay |

### EventEmitter minimum API

```text
on(event, fn)    → subscribe
off(event, fn)   → unsubscribe
emit(event, ...args)  → publish
once(event, fn)  → subscribe once (auto-unsubscribe after running)
```

### promisify in three steps

```text
1. Return a new function
2. Inside it, new Promise
3. Call the original function with an error-first callback: (err, data) => err ? reject : resolve
```

## Handwritten code / flowcharts

### debounce (with leading / trailing / cancel)

```js
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null
  let isInvoked = false  // whether leading has already fired

  const debounced = function (...args) {
    if (timer) clearTimeout(timer)

    if (leading && !isInvoked) {
      fn.apply(this, args)
      isInvoked = true
    }

    timer = setTimeout(() => {
      if (trailing && isInvoked !== true || trailing && !leading) {
        fn.apply(this, args)
      }
      timer = null
      isInvoked = false
    }, delay)
  }

  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
    isInvoked = false
  }

  return debounced
}
```

### throttle (timestamp version)

```js
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
```

### EventEmitter

```js
class EventEmitter {
  constructor() {
    this._events = Object.create(null)
  }

  on(event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn)
    return this
  }

  off(event, fn) {
    const fns = this._events[event]
    if (!fns) return this
    this._events[event] = fns.filter(f => f !== fn && f._orig !== fn)
    return this
  }

  emit(event, ...args) {
    const fns = this._events[event]
    if (!fns) return false
    fns.forEach(fn => fn.apply(this, args))
    return true
  }

  once(event, fn) {
    const wrapper = (...args) => {
      fn.apply(this, args)
      this.off(event, wrapper)
    }
    wrapper._orig = fn  // so off can match the original function
    this.on(event, wrapper)
    return this
  }
}
```

### promisify

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}
```

## Oral questions

### 1. How do you choose debounce vs throttle by scenario?

Answer template:

> Debounce fits "wait until the user stops, then run" scenarios, e.g. a search box: wait 300ms after typing stops before sending a request, so every keystroke does not fire. Throttle fits "cap the run frequency" scenarios, e.g. lazy-load checks on scroll: you do not need to handle every scroll event; once every 200ms is enough.
>
> Simple memory aid: debounce is like an elevator door (someone arriving resets the wait); throttle is like a traffic light (release once on a fixed interval).
>
> Follow-up on leading/trailing: debounce defaults to trailing (run last); add `leading: true` to fire immediately the first time. Throttle defaults to leading (first call immediately); a timer-based version can implement trailing.

### 2. How do you explain turning a Promise-style API into async style?

Answer template:

> `promisify` turns a Node.js-style error-first callback into a function that returns a Promise. The core is returning a new function, `new Promise` inside it, and replacing the original last argument with `(err, data) => err ? reject(err) : resolve(data)`.
>
> Node.js ships `util.promisify`, and also supports a custom `[Symbol('nodejs.util.promisify.custom')]`. In the browser, a few handwritten lines are enough if you need it. After conversion you can write async code in a sync style with `async / await`.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Debounce/throttle principle + scenarios + leading/trailing (2 minutes)
2. EventEmitter's 4 APIs + how once is implemented (1.5 minutes)
3. promisify's three steps + the error-first callback convention (1.5 minutes)

Self-check after recording:

- Did you say debounce = "wait until it stops", throttle = "fixed frequency"?
- Did you say once uses a wrapper + off after running?
- Did you mention promisify's error-first callback convention?
- Did you mention what the `cancel` method is for?

## Today's review

The 3 points that most need follow-up today:

1. Edge handling when `leading: true, trailing: true` are both on (run once at the start and once at the end).
2. Array mutation if EventEmitter's `off` is called while `emit` is iterating (copy before iterating).
3. Extending `promisify` for multi-value callbacks such as `(err, data1, data2)`.
