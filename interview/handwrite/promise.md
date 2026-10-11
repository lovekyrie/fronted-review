# 手写 Promise

用这道练习说明状态机、回调队列、非函数处理器的值穿透，以及 `then` 返回的新 Promise。语义说明见 [Promise 专题](../jscore/advanced/promise)。

## 核心骨架

> 注：下面是面试可接受的“核心骨架”，未实现 Promises/A+ 中的 `resolvePromise`（thenable 解析）。如果 `onFulfilled` 返回的是 Promise / thenable，严格实现需要调用 `x.then(resolve, reject)` 跟随其状态，还要检查循环引用。被追问时需补充说明。

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
    // 值穿透：如果不是函数，直接透传 value
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
        // pending 状态，先收集回调
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

这是面试用的有限骨架：尚未吸收返回的 thenable、检测循环引用，也没有完整的决议过程。补全时应让 `resolve` 跟随返回的 Promise / thenable 状态，并拒绝自解析。
