---
title: 事件循环与任务调度
description: JavaScript 事件循环机制、Node.js 阶段机制、requestAnimationFrame 位置、微任务优先级深度剖析
---

### Event Loop (事件循环)
JavaScript是单线程语言，通过事件循环机制实现异步操作。

#### 执行栈 (Call Stack)
JS 引擎用来管理函数调用的数据结构。
- **LIFO**：后进先出。
- **同步**：代码一行行入栈执行，执行完出栈。
- **单线程**：同一时间只能执行栈顶的一个任务。

```js
function first() {
  console.log('first');
  second();
}

function second() {
  console.log('second');
  third();
}

function third() {
  console.log('third');
}

first();
// 输出顺序：first, second, third
```

#### 任务队列 (Task Queue)
异步任务执行完后，其回调函数会进入任务队列等待。队列分为两类：
- **宏任务 (Macro Task)**：由宿主环境（浏览器/Node）发起的任务。
- **微任务 (Micro Task)**：由 JS 引擎自身发起的任务。

1. **宏任务**
   - `setTimeout` / `setInterval`
   - `setImmediate` (Node)
   - I/O (文件读写、网络请求)

2. **微任务**
   - `Promise.then/catch/finally`
   - `MutationObserver`
   - `queueMicrotask`

`requestAnimationFrame` 是渲染回调，不属于宏任务或微任务；渲染本身也不是宏任务。Node.js 的 `process.nextTick` 使用独立队列，通常先于 Promise 微任务执行。

#### 事件循环过程 (Event Loop)
这是 JS 实现异步的核心机制。
1. **同步代码**：从上到下执行，压入执行栈，执行完清空。
2. **清空微任务**：在微任务检查点持续执行微任务，直到队列清空。
3. **渲染 UI**：(浏览器) 此时可能会进行一次页面渲染。
4. **执行宏任务**：从宏任务队列中取**一个**执行。
5. **循环**：回到步骤 2。

**口诀**：同步 -> 微任务(所有) -> 渲染 -> 宏任务(一个) -> 微任务(所有) ...

```js
console.log('1'); // 同步

setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // 微任务
});

console.log('4'); // 同步

// 输出顺序：1, 4, 3, 2
```

#### 常见面试题
1. **async/await 执行顺序**
   - `await` 后面的代码相当于 `Promise.then`，属于微任务。
   - `await` 同一行的右侧代码是同步执行的。

```js
async function async1() {
  console.log('1');
  await async2(); // async2() 同步执行
  console.log('2'); // 微任务
}

async function async2() {
  console.log('3');
}

console.log('4');
async1();
console.log('5');

// 输出顺序：4, 1, 3, 5, 2
```

2. **嵌套 Promise**
   - 内部的 `then` 会先注册，外部的后续 `then` 也是微任务，但注册时机受决议时间影响。

```js
Promise.resolve().then(() => {
  console.log('1');
  return Promise.resolve().then(() => {
    console.log('2');
  });
}).then(() => {
  console.log('3');
});

// 输出顺序：1, 2, 3
```

3. **Node.js 中的 process.nextTick**
   - 它的优先级**高于** Promise。
   - 在当前阶段的同步代码执行完后，立即执行 nextTick，然后再去执行 Promise 微任务。

```js
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// 输出：nextTick -> Promise
```

#### 浏览器和Node.js的区别
- **浏览器**：微任务队列在每个宏任务执行完后清空。
- **Node 11+**：行为与浏览器趋于一致。
- **Node 10 及以下**：每个阶段（Timer, I/O...）结束后才清空微任务，现在已淘汰，面试通常以最新标准为准。

```js
// Node.js环境
setImmediate(() => {
  console.log('1');
});

setTimeout(() => {
  console.log('2');
}, 0);

// 输出顺序：随机。取决于 node 启动时的性能和初始化耗时。
```

#### 最佳实践
1. **避免长时间的同步任务**：这会阻塞事件循环，导致页面卡顿。对于复杂计算，使用 `Web Workers`。
2. **理解宏任务与微任务的执行时机**：`Promise` 和 `MutationObserver` 优先于 `setTimeout`，适合处理高优先级的数据更新。
3. **不要滥用定时器**：重复嵌套定时器可能被钳制到至少 4ms，普通零延迟定时器不一定有 4ms 下限，不适合高精度计时。动画请用 `requestAnimationFrame`。

---

## 高频追问与深层原理

### Node.js 阶段机制（libuv 事件循环）

Node.js 的事件循环分多个**阶段（Phase）**，每个阶段处理特定任务：

```
┌───────────────────────┐
│        timers         │  执行 setTimeout/setInterval 回调
│   (阶段1: 定时器)      │
└───────────────────────┘
         ↓
┌───────────────────────┐
│  pending callbacks    │  执行延迟到下一循环的 I/O 回调
│   (待定回调)          │
└───────────────────────┘
         ↓
┌───────────────────────┐
│    idle, prepare      │  内部使用
└───────────────────────┘
         ↓
┌───────────────────────┐
│        poll           │  获取新的 I/O 事件（网络、文件等）
│   (轮询阶段)          │  队列非空时执行回调，队列空则阻塞等待
└───────────────────────┘
         ↓
┌───────────────────────┐
│        check          │  执行 setImmediate 回调
│   (检查阶段)          │
└───────────────────────┘
         ↓
┌───────────────────────┐
│   close callbacks     │  执行 close 事件回调（如 socket.on('close')）
│   (关闭回调)          │
└───────────────────────┘
```

#### 各阶段的典型任务

| 阶段 | 任务 | 典型 API |
|------|------|----------|
| timers | 定时器回调 | `setTimeout`, `setInterval` |
| pending callbacks | 系统错误回调 | `fs.rename` 失败回调 |
| poll | I/O 轮询 | `fs.readFile`, `net.socket` |
| check | 立即回调 | `setImmediate` |
| close | 关闭回调 | `socket.on('close')` |

#### 微任务在 Node.js 中的执行时机

```js
// 当前 Node.js 在回调执行后也会处理 nextTick 与 Promise 微任务

// 阶段：timers
setTimeout(() => console.log('timeout'))

// 阶段：check（timers 之后）
setImmediate(() => console.log('immediate'))

// 输出顺序（timers vs setImmediate）：
// 如果 timeout 先于 check 加入队列：timeout -> immediate
// 如果 poll 阶段变空且 check 阶段有回调：setImmediate 先执行
// 结论：不确定，取决于当前 event loop 状态
```

#### 进阶：为什么不建议在定时器里执行重操作

```js
// 错误示例：长时间计算阻塞 timers 阶段
setInterval(() => {
  heavyCpuTask() // 假设计算密集
}, 1000)

// 正确做法：用 requestIdleCallback 或分片
function chunkedTask(tasks, callback) {
  let index = 0
  function step(deadline) {
    while (index < tasks.length && deadline.timeRemaining() > 0) {
      tasks[index++]()
    }
    if (index < tasks.length) {
      requestIdleCallback(step)
    } else {
      callback()
    }
  }
  requestIdleCallback(step)
}
```

---

### requestAnimationFrame 在事件循环中的位置

`requestAnimationFrame`（RAF）在浏览器事件循环中的位置比较特殊：

#### RAF 的执行时机

```text
任务 → 微任务检查点 → 渲染机会（如果需要）
                         → rAF 回调 → style/layout/paint
```

**RAF 的回调在渲染之前执行**，所以适合做动画。

#### RAF vs setTimeout(16ms) 做动画

```js
// setTimeout 方案
let lastTime = 0
function animate(time) {
  if (time - lastTime >= 16) { // ~60fps
    lastTime = time
    // 动画逻辑
  }
  setTimeout(() => animate(performance.now()), 16)
}

// RAF 方案（推荐）
function animate() {
  // 浏览器在绘制机会前调度，不保证固定 60fps
  requestAnimationFrame(animate)
}
```

| 维度 | setTimeout | RAF |
|------|-----------|-----|
| 精度 | 不稳定，可能掉帧 | 跟随屏幕刷新时机 |
| 节流 | 手动计算时间差 | 自动 |
| 页面隐藏 | 可能被节流 | 通常暂停（节省 CPU） |
| 移动端省电 | 不支持 | 支持 |

---

### queueMicrotask 使用场景

`queueMicrotask` 允许将回调排队为微任务，比 `Promise.then` 更底层：

```js
// 场景1：确保在当前微任务队列清空后执行
queueMicrotask(() => {
  console.log('microtask')
})

// 场景2：替代 MutationObserver 做简单 DOM 变化监听
// （更轻量，不需要创建 Observer 实例）
function whenElementReady(selector, callback) {
  const el = document.querySelector(selector)
  if (el) {
    callback(el)
  } else {
    queueMicrotask(() => whenElementReady(selector, callback))
  }
}

// 场景3：避免 Promise.then 的额外开销
// Promise.then 需要创建 3 个 Promise（resolve/reject 包装）
// queueMicrotask 更轻量
queueMicrotask(() => {
  // 直接执行，零额外开销
  syncData()
})
```

---

### 浏览器 vs Node.js 事件循环完整差异

| 维度 | 浏览器 | Node.js |
|------|--------|---------|
| 渲染 | 有（每个 tick 可能渲染） | 无（无 UI） |
| 阶段 | 无（简单循环） | 多个阶段（timers/poll/check/close） |
| 微任务时机 | 每个任务后的检查点 | 当前 Node.js 通常在回调后处理微任务 |
| setImmediate | 不支持 | 支持 |
| process.nextTick | 不支持 | 支持（高于 Promise） |
| queueMicrotask | 支持 | 支持 |

#### Node.js 微任务优先级

```js
process.nextTick(() => console.log('1')) // 最高
queueMicrotask(() => console.log('2'))   // 其次
Promise.resolve().then(() => console.log('3')) // 最后
// 输出：1 -> 2 -> 3
```

#### 浏览器环境微任务

```js
queueMicrotask(() => console.log('1'))
Promise.resolve().then(() => console.log('2'))
// 输出：1 -> 2（两者都是微任务，按队列顺序）
```

---

## 面试回答模板

**问题**：JavaScript 事件循环机制？

**高分回答**：

> JavaScript 是单线程语言，通过事件循环实现异步。核心机制是：
>
> 1. **执行栈**执行同步代码
> 2. 执行栈清空后，**微任务队列**全部执行（Promise、queueMicrotask、MutationObserver）
> 3. 如果是浏览器，可能触发一次**渲染**
> 4. 从**任务队列**取一个执行（setTimeout、setInterval、I/O）；RAF 属于渲染阶段
> 5. 回到步骤 2，循环
>
> 关键点：**微任务在每个宏任务后全部清空**，所以 `Promise.then` 比 `setTimeout` 先执行。
>
> Node.js 有多个阶段（timers/poll/check）；当前版本会在回调之后处理 `process.nextTick` 与 Promise 微任务，`nextTick` 通常先执行。

---

## 相关链接

- [Node.js 事件循环文档](https://nodejs.org/en/guides/event-loop-timers-and-nexttick)
- [MDN 并发模型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)
- [Jake Archibald's event loop article](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

## 事件循环输出练习

先写出每一步的入队时机，再核对输出：

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
Promise.resolve().then(() => {
  console.log('4')
  setTimeout(() => console.log('5'), 0)
})
console.log('6')
// 1 → 6 → 3 → 4 → 2 → 5
```

下面的 `micro` 先于下一任务执行；`timeout` 与 `rAF` 的先后取决于下一次渲染机会，不能写死。`rAF` 回调里排入的微任务也会在之后的微任务检查点运行。

```js
requestAnimationFrame(() => {
  console.log('rAF')
  Promise.resolve().then(() => console.log('micro in rAF'))
})
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('micro'))
```
