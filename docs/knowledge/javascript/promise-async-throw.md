# 异步回调里的 throw 进不了 Promise 的 catch

> Related source: [interview/jscore/advanced/promise.md](../../../interview/jscore/advanced/promise.md)

## Meaning

`new Promise` 只会接住 `executor` 同步执行期间抛出的错误。`setTimeout`、事件回调是之后另一次调用，里面的 `throw` 不会变成这个 Promise 的 `rejected`。

同步抛错能被 `catch`：

```js
new Promise(() => {
  throw new Error('sync')
}).catch(err => console.log('caught', err.message))
// caught sync
```

回调里抛错接不住，Promise 一直是 `pending`：

```js
new Promise((resolve) => {
  setTimeout(() => {
    throw new Error('async')
    resolve('ok')
  }, 0)
}).catch(err => console.log('caught', err.message))
// catch 不会执行，错误变成未捕获异常
```

要把异步操作 Promise 化：在回调里调用 `reject`，或者用 `try/catch` 再 `reject`。

```js
function readLater() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        JSON.parse('{')
        resolve('ok')
      }
      catch (err) {
        reject(err)
      }
    }, 0)
  })
}

readLater().catch(err => console.log('caught', err.message))
```

Node 风格的 `(err, data) => {}` 同样要在 `err` 存在时 `reject(err)`，只 `throw err` 也到不了外层 `catch`。

## In This Project

`interview/jscore/advanced/promise.md` 第 7.1 节指的就是上面这种「回调里抛错、外层 catch 接不住」。
