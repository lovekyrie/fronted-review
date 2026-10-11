# 发布订阅模式 (EventEmitter)

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

  // 发布订阅后立即删除
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

## 每日练习参考

### Day 12：EventEmitter 最小 API

```text
on(event, fn)    → 订阅
off(event, fn)   → 取消
emit(event, ...args)  → 发布
once(event, fn)  → 订阅一次（执行后自动取消）
```

### Day 12：EventEmitter

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
    wrapper._orig = fn  // off 时能匹配原函数
    this.on(event, wrapper)
    return this
  }
}
```
