# Pub/sub (EventEmitter)

```javascript
class EventEmitter {
  constructor() {
    this.subs = {}
  }

  on(event, cb) {
    (this.subs[event] || (this.subs[event] = [])).push(cb)
  }

  trigger(event, ...args) {
    this.subs[event]
    && this.subs[event].forEach((cb) => {
      cb(...args)
    })
  }

  // Remove the listener right after it runs
  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args)
      this.off(event, cb)
    }
    this.on(event, cb)
  }

  off(event, offCb) {
    if (this.subs[event]) {
      const index = this.subs[event].findIndex(cb => cb === offCb)
      this.subs[event].splice(index, 1)
      if (!this.subs[event].length)
        delete this.subs[event]
    }
  }
}

const dep = new EventEmitter()

function cb() {
  console.log('handleClick')
}

function cb2() {
  console.log('handleMouseover')
}

console.group()
dep.on('click', cb)
dep.on('click', cb2)
dep.trigger('click')
console.groupEnd()

console.group()
dep.off('click', cb)
dep.trigger('click')
console.groupEnd()

console.group()
dep.once('mouseover', cb2)
dep.trigger('mouseover')
dep.trigger('mouseover')
console.groupEnd()
```

## Daily practice reference

### Day 12: EventEmitter minimum API

```text
on(event, fn)    → subscribe
off(event, fn)   → unsubscribe
emit(event, ...args)  → publish
once(event, fn)  → subscribe once (auto-unsubscribe after running)
```

### Day 12: EventEmitter

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
