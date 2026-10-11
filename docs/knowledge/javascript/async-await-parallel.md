# 去掉 await 之后请求会并行，但不会等待结果

> Related source: [interview/jscore/basic/es6.md](../../../interview/jscore/basic/es6.md)

## Meaning

`await` 暂停的是当前 `async` 函数，不会阻止下一次函数调用。下面两行会先后立刻调用 `fetchA` 和 `fetchB`，两个 Promise 同时处于 pending，请求在时间上重叠：

```js
async function loadData() {
  const a = fetchA()
  const b = fetchB()
}
```

这时 `a`、`b` 是 Promise，不是响应数据。`loadData` 在两次调用之后就返回了，调用方不会等到请求结束。任一请求失败且没有人 `await` / `.catch`，会变成未处理的 rejection。

要并行并且拿到结果，先发起再一起等：

```js
const aPromise = fetchA()
const bPromise = fetchB()
const a = await aPromise
const b = await bPromise
```

总耗时约等于较慢的那一个。`await Promise.all([fetchA(), fetchB()])` 是同一件事，并且任一失败会立刻拒绝。

先 `await fetchA()` 再 `await fetchB()` 才会串行，总耗时是两者相加。

## In This Project

`interview/jscore/basic/es6.md` 的陷阱 1 用连续 `await` 说明串行。去掉那两个 `await` 会让请求重叠，但不再等待完成。

## 什么时候可以不写 async

不需要结果、函数体里也没有 `await` 时，`loadData` 不必写成 `async`。连续调用就会让两个请求重叠：

```js
function loadData() {
  fetchA()
  fetchB()
}
```

`async` 本身不决定串行还是并行。并行来自「调用 `fetchB` 之前没有等待 `fetchA`」。

`fetchB` 要用 `fetchA` 的返回值时，只能等 `fetchA` 完成后再调用 `fetchB`，这时必然串行：

```js
async function loadData() {
  const a = await fetchA()
  await fetchB(a)
}
```

这里的 `await` 写在调用前面，外层函数必须是 `async`。
