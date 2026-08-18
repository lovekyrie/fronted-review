# Day 3 异步模型与事件循环 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 3 | 异步与事件循环 | [事件循环](../jscore/basic/event-loop)、[异步编程](../jscore/basic/async-program)、[Promise](../jscore/advanced/promise)、[async/await](../jscore/advanced/async-await) |

## 今日目标

- 看完 `/jscore/basic/event-loop`、`/jscore/basic/async-program`、`/jscore/advanced/promise`、`/jscore/advanced/async-await`
- 手写 Promise 核心（状态机 + then 链 + 值穿透）
- 画一张宏任务/微任务执行顺序图

## 阅读卡点

- `await` 后的代码是挂载为**微任务**执行，而非阻塞同步
- `setTimeout(fn, 0)` ≠ 立即执行：要等同步代码 + 微任务清空，且 HTML spec 规定嵌套 ≥ 5 层后 timeout 会被 clamp 到至少 4ms
- `Promise.resolve().then` 只入微任务队列一次，嵌套会重新入队

## 速记卡 / 知识点

### 事件循环三段式

事件循环的执行顺序：

```text
1. 执行栈（同步代码）
2. 微任务队列（Promise.then / await / queueMicrotask / MutationObserver）
3. （可选）渲染管线：rAF -> Style -> Layout -> Paint
4. 宏任务队列（setTimeout / setInterval / I/O / MessageChannel）
```

每执行完一个宏任务，都会回头检查微任务队列是否为空，如果不为空则先执行完所有微任务，再取下一个宏任务。

**微任务比宏任务优先级高得多**，这是 JS 异步的核心。

### 宏任务 / 微任务分类

| 宏任务 | 微任务 |
|--------|--------|
| `setTimeout` | `Promise.then / catch / finally` |
| `setInterval` | `queueMicrotask` |
| `MessageChannel / postMessage` | `MutationObserver` |
| I/O、UI 事件回调 | `process.nextTick`（Node，优先级高于 Promise） |

> 注意：**`UI render` 不是宏任务**，它是浏览器在“一个宏任务 + 所有微任务”执行完后判断是否需要进行的独立阶段。
>
> **`requestAnimationFrame` 严格说不是宏任务也不是微任务**，它是独立的 rAF 回调队列，在每帧渲染前、样式计算之前执行，频率与屏幕刷新率同步（通常 60fps）。

### 常见执行顺序题

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

// 正确答案：1 → 5 → 4 → 2 → 3
// 解析：
// 1. 同步代码：1、5
// 2. 微任务：4
// 3. 第一个宏任务（setTimeout）：2，打印2后产生微任务3
// 4. 执行微任务：3
```

### Promise 三态

Promise 有三种状态：

- **`pending`**（待定）：初始状态，可以转换为 `fulfilled` 或 `rejected`
- **`fulfilled`**（已兑现）：操作成功，调用 `onFulfilled`
- **`rejected`**（已拒绝）：操作失败，调用 `onRejected`

**状态转换只能单向且不可逆**：pending → fulfilled 或 pending → rejected。一旦状态确定，就不能再改变。

### 值穿透

**值穿透是指：`then / catch` 的参数期望是函数，如果传入的不是函数（数字、字符串、`null` 等），则该一节 then 会被忽略，前一个 Promise 的值会跨过这个 then 直接传给下一个 then。**

```js
Promise.resolve(1)
  .then(2)              // 参数不是函数，发生值穿透
  .then(null)           // 参数不是函数，继续穿透
  .then(console.log)    // 输出 1，不是 2
```

实现关键（在后面手写 Promise 中体现）：

```js
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
```

要区分开“值穿透”和“普通的链式返回传递”。以下不是值穿透，只是 then 回调返回了一个普通值：

```js
Promise.resolve(1)
  .then(res => res * 2)      // 回调是函数，返回 2
  .then(res => res + 1)      // 回调是函数，返回 3
  .then(console.log)         // 打印 3
```

如果回调返回的是 Promise，下一个 then 会等待它 resolve：

```js
Promise.resolve(1)
  .then(res => Promise.resolve(res * 2))  // 返回 Promise<2>
  .then(console.log)                      // 打印 2
```

### async/await 等价展开

`async` 函数就是返回 Promise 的函数，`await` 就是等待 Promise resolve 的语法糖：

```js
// async 函数
async function fetchData() {
  const data = await fetch('/api')
  return data
}

// 等价展开
function fetchData() {
  return fetch('/api')
    .then(data => data)
}
```

### 常见误解澄清

1. **`await` 不是阻塞**：await 只是让出执行权，把后续代码注册为微任务，继续执行同步代码。
2. **`setTimeout(fn, 0)` 不保证立即执行**：要等同步代码 + 所有微任务执行完才有机会运行；且 HTML spec 规定嵌套 ≥ 5 层的 `setTimeout` 会被 clamp 到至少 4ms，所以深度嵌套会越变越慢。
3. **`Promise.resolve().then` 的嵌套**：每次 `.then` 都会产生一个新的微任务，不是在同一个微任务里连续执行。

## 手写 / 流程图

### 手写 Promise 核心骨架：状态、then 链、值穿透

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

### 宏任务/微任务执行顺序图

```text
┌─────────────────────────────────────────────────┐
│                 执行栈（同步代码）                  │
│  console.log('1')                                │
│  console.log('5')                                │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  微任务队列（所有 Promise.then / await）          │
│  1. 微任务：() => console.log('4')              │
│  2. 微任务：() => console.log('3')（setTimeout  │
│     触发后进入）                                   │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  宏任务队列（setTimeout / setInterval / I/O）    │
│  1. 宏任务：() => { console.log('2');          │
│                 微任务3 }                        │
└─────────────────────────────────────────────────┘

输出顺序：1 → 5 → 4 → 2 → 3
```

## 口述题

### 1. 为什么 `await` 后面的代码像"同步"？

回答模板：

> `await` 后面的代码看起来像同步，是因为它把后续代码包装成了 Promise 的 `.then` 回调，微任务执行时机在当前宏任务结束后、同步代码全部完成后，看起来就像同步等待。但实际上 `await` 只是让出执行权，同步代码继续往下走，等微任务队列轮到时才执行 `await` 后的代码。
>
> 关键点：区分"让出执行权"和"阻塞"。`await` 不阻塞同步代码，它只是把后续代码注册为微任务。当前宏任务中的同步代码全部执行完后，才执行微任务队列，这时 `await` 后的代码才开始运行。
>
> 举例：`await fetch('/api')` 不会卡住主线程，`fetch` 发请求的同时，同步代码继续执行，只是 `fetch` 后面的代码在微任务里排队，等 `fetch` resolve 后才执行。

### 2. `Promise.all` 和 `allSettled` 场景差异？

回答模板：

> `Promise.all` 是"全成功才成功"，有一个 rejected，整个 Promise 就会 reject，适合并行独立任务需要全部成功才继续的场景。
>
> `Promise.allSettled` 是"不管成功失败，全部等完"，每个 Promise 的结果都会被保留，fulfilled 或 rejected 都能看到，适合需要收集所有结果、即使部分失败也不中断的场景。
>
> 举具体例子：发送多个请求，**知道每个都成功才能继续**用 `all`；**不管成功失败都要知道结果**（比如页面加载多个组件，部分组件失败不影响其他组件展示），用 `allSettled`。

### 3. 什么是“值穿透”，什么时候会发生？

回答模板：

> 值穿透是 Promise 链中一个很容易误会的点。它指的是：`then` 和 `catch` 的参数期望是函数，如果传入的不是函数——比如传了一个数字、字符串、`null`，该一节 then 会被忽略，前一个 Promise 的值会直接跨过这个 then，传给下一个 then。
>
> 标准例子是 `Promise.resolve(1).then(2).then(null).then(console.log)`，输出是 `1`，不是 `2`，因为 `2` 和 `null` 都不是函数，发生了值穿透。
>
> 实现上其实就一行代码：`then` 中如果 `onFulfilled` 不是函数，就默认赋为 `v => v`，如果 `onRejected` 不是函数，就默认赋为 `e => { throw e }`。
>
> 注意要和“链式返回传递”区分开：`then(res => res * 2)` 这种是回调返回了一个普通值，不叫值穿透，只是正常的链式传递。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 事件循环分段：执行栈 → 微任务 → 渲染 → 宏任务（2 分钟）
2. Promise 状态机 + then 链 + 值穿透（2 分钟）
3. async/await 等价展开（1 分钟）

录完后自查：

- 是否说出微任务比宏任务优先级高。
- 是否说出 `queueMicrotask` 和 `setTimeout` 的区别。
- 是否说出 Promise 三态（pending / fulfilled / rejected）及其转换。
- 是否说出 `await` 是"让出执行权"而非"阻塞"。

## 今日复盘

今天最需要回补的 3 个点：

1. `queueMicrotask` 手动入队微任务和 `Promise.then` 入队的区别。
2. `requestAnimationFrame` 在事件循环中的位置（每帧渲染前，属于宏任务）。
3. `async` 函数的返回值一定是 Promise，但 `return await` 和直接 `return` 的行为差异。