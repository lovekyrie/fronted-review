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
