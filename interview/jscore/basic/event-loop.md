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
   - `requestAnimationFrame` (浏览器)
   - I/O (文件读写、网络请求)
   - UI rendering

2. **微任务**
   - `Promise.then/catch/finally`
   - `process.nextTick` (Node, 优先级最高)
   - `MutationObserver`
   - `queueMicrotask`

#### 事件循环过程 (Event Loop)
这是 JS 实现异步的核心机制。
1. **同步代码**：从上到下执行，压入执行栈，执行完清空。
2. **清空微任务**：当执行栈为空时，立即执行**所有**微任务队列中的任务。
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
2. **理解微任务优先级**：`Promise` 和 `MutationObserver` 优先于 `setTimeout`，适合处理高优先级的数据更新。
3. **不要滥用定时器**：`setTimeout` 有最小延迟（4ms），不适合高精度计时。动画请用 `requestAnimationFrame`。 