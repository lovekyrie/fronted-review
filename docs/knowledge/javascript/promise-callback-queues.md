# 手写 Promise 为什么要回调数组

> Related source: [interview/jscore/basic/async-program.md](../../../interview/jscore/basic/async-program.md)

## Meaning

`then` 可能在 `resolve` / `reject` 之前就被调用。这时状态还是 `pending`，回调不能马上执行，只能先存起来。一个 Promise 可以挂多个 `then`，所以用数组，等状态变成 `fulfilled` 或 `rejected` 时再逐个调用。

`executor(resolve, reject)` 是构造时立刻执行用户传入的函数，把这两个改状态的函数交出去。用户稍后调用 `resolve` 或 `reject`，才会清空对应的回调数组。这一行只负责「开工」，对象之所以像 Promise，是因为同时有三件事：状态只变一次、`then` 负责登记、`resolve` / `reject` 负责补发。

这份简易实现还缺规范里的几项：`then` 应返回新的 Promise，回调应放进微任务，还要处理 thenable。

## In This Project

`interview/jscore/basic/async-program.md` 的 `MyPromise` 在 `pending` 时把 `onFulfilled` / `onRejected` 推进两个数组，在 `resolve` / `reject` 里 `forEach` 执行。
