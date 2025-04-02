const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(execute) {
  const self = this
  self.state = PENDING
  self.onFulfilledArray = []
  self.onRejectedArray = []

  function resolve(value) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = FULFILLED
        self.value = value
        self.onFulfilledArray.forEach(fn => fn(self.value))
      }
    })
  }

  // 这里为什么需要setTimeout是因为在 then的pengding中并没有setTimeout
  function reject(reason) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = REJECTED
        self.reason = reason
        self.onRejectedArray.forEach(fn => fn(self.reason))
      }
    })
  }

  try {
    execute(resolve, reject)
  }
  catch (error) {
    reject(error)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function'
    ? onFulfilled
    : function (x) {
      return x
    }
  onRejected = typeof onRejected === 'function'
    ? onRejected
    : function (e) {
      throw e
    }

  const self = this
  let promise
  switch (self.state) {
    case FULFILLED:
      promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(self.value)
            resolvePromise(promise, x, resolve, reject)
          }
          catch (error) {
            reject(error)
          }
        })
      })
      break
    case REJECTED:
      promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(self.reason)
            resolvePromise(promise, x, resolve, reject)
          }
          catch (error) {
            reject(error)
          }
        })
      })
      break
    case PENDING:
      // todo
      promise = new Promise((resolve, reject) => {
        self.onFulfilledArray.push(() => {
          try {
            const x = onFulfilled(self.value)
            resolvePromise(promise, x, resolve, reject)
          }
          catch (error) {
            reject(error)
          }
        })
        self.onRejectedArray.push(() => {
          try {
            const x = onRejected(self.reason)
            resolvePromise(promise, x, resolve, reject)
          }
          catch (error) {
            reject(error)
          }
        })
      })
      break
  }

  return promise
}

function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('x 不能与 promise相等'))
  }

  if (x instanceof Promise) {
    if (x.state === FULFILLED) {
      resolve(x.value)
    }
    else if (x.state === REJECTED) {
      reject(x.reason)
    }
    else {
      x.then(y => resolvePromise(promise, y, resolve, reject), reject)
    }
  }
  else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let executed
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (executed)
            return
          executed = true
          resolvePromise(promise, y, resolve, reject)
        }, (e) => {
          if (executed)
            return
          executed = true
          reject(e)
        })
      }
      else {
        resolve(x)
      }
    }
    catch (error) {
      if (executed)
        return
      executed = true
      reject(error)
    }
  }
  else {
    resolve(x)
  }
}
export default Promise
