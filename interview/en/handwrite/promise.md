# Handwrite Promise

Use this exercise to explain the state machine, queued callbacks, pass-through handlers, and the Promise returned by `then`. [Promise concepts](../jscore/advanced/promise) cover the semantics.

## Core skeleton

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

This is a limited interview sketch. It does not adopt returned thenables, reject cycles, or implement the full resolution procedure. For a complete implementation, make `resolve` follow a returned Promise or thenable and reject self-resolution before running the chain.
