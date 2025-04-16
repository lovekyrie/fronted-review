class EventEmitter {
  eventGroup = {}
  /**
   * @param {string} eventName
   * @param {Function} callback
   * @return {object}
   */
  subscribe(eventName, callback) {
    if (!this.eventGroup[eventName]) {
      this.eventGroup[eventName] = []
    }
    this.eventGroup[eventName].push(callback)
    return {
      unsubscribe: () => {
        // 因为他可以传递调用那个subscribe的取消订阅事件
        this.eventGroup[eventName] = this.eventGroup[eventName].filter(k => k !== callback)
        if (!this.eventGroup[eventName])
          delete this.eventGroup[eventName]
      },
    }
  }

  /**
   * @param {string} eventName
   * @param {Array} args
   * @return {Array}
   */
  emit(eventName, args = []) {
    // 触发event
    if (!this.eventGroup[eventName])
      return []
    return this.eventGroup[eventName].map(fn => fn(...args))
  }
}

/**
 * const emitter = new EventEmitter();
 *
 * // Subscribe to the onClick event with onClickCallback
 * function onClickCallback() { return 99 }
 * const sub = emitter.subscribe('onClick', onClickCallback);
 *
 * emitter.emit('onClick'); // [99]
 * sub.unsubscribe(); // undefined
 * emitter.emit('onClick'); // []
 */

const emitter = new EventEmitter()
const sub1 = emitter.subscribe('firstEvent', x => x + 1)
const sub2 = emitter.subscribe('firstEvent', x => x + 2)
const sub3 = emitter.subscribe('firstEvent', x => x + 3)
sub2.unsubscribe()
sub3.unsubscribe()
emitter.emit('firstEvent')
