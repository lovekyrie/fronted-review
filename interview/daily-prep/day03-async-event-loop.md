# Day 3 异步模型与事件循环

## 今日目标

- 看完 `/jscore/basic/event-loop`、`/jscore/basic/async-program`、`/jscore/advanced/promise`、`/jscore/advanced/async-await`
- 手写 Promise 核心（状态机 + then 链 + 值穿透）
- 画一张宏任务/微任务执行顺序图

## 按顺序阅读

1. [事件循环](../jscore/basic/event-loop)
2. [异步编程](../jscore/basic/async-program)
3. [Promise](../jscore/advanced/promise)
4. [async/await](../jscore/advanced/async-await)

## 实操与自测

**检查点**

- `await` 后的代码是挂载为**微任务**执行，而非阻塞同步
- `setTimeout(fn, 0)` ≠ 立即执行：要等同步代码 + 微任务清空，重复嵌套的定时器可能被钳制到至少 4ms
- `Promise.resolve().then` 只入微任务队列一次，嵌套会重新入队

**先独立完成，再对照专题**

- 预测 
```js
console.log('1'); 
setTimeout(() => console.log('2'), 0); 
Promise.resolve().then(() => console.log('3')); 
console.log('4')
```
```js
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
})

console.log('5')
```
 的输出，并画出任务与微任务队列。[核对事件循环](../jscore/basic/event-loop#event-loop-事件循环)
- 解释 Promise 三态、值穿透及 `then` 返回新 Promise。[核对 Promise 专题](../jscore/advanced/promise#_4-手写-promise)
- 脱稿实现 Promise 状态机、回调队列和 `then` 链。[核对手写实现](../handwrite/promise#核心骨架)
- 解释 `await` 的让出时机，并比较独立请求的串行与并行。[核对 async/await](../jscore/advanced/async-await#_4-常见坑点-串行与并行)

**脱稿口述题**

- 1. 为什么 `await` 后面的代码像"同步"？
- 2. `Promise.all` 和 `allSettled` 场景差异？
- 3. 什么是“值穿透”，什么时候会发生？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 事件循环分段：执行栈 → 微任务 → 渲染 → 宏任务（2 分钟）
2. Promise 状态机 + then 链 + 值穿透（2 分钟）
3. async/await 等价展开（1 分钟）

录完后自查：

- 是否说出微任务比宏任务优先级高。
- 是否说出 `queueMicrotask` 和 `setTimeout` 的区别。
- 是否说出 Promise 三态（pending / fulfilled / rejected）及其转换。
- 是否说出 `await` 是"让出执行权"而非"阻塞"。

## 复盘

今天最需要回补的 3 个点：

1. `queueMicrotask` 手动入队微任务和 `Promise.then` 入队的区别。
2. `requestAnimationFrame` 在事件循环中的位置（渲染机会前，属于渲染回调，不是宏任务）。
3. `async` 函数的返回值一定是 Promise，但 `return await` 和直接 `return` 的行为差异。
