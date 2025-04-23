### Event Loop (事件循环)
JavaScript是单线程语言，通过事件循环机制实现异步操作。

#### 执行栈 (Call Stack)
执行栈是一个存储函数调用的栈结构，遵循后进先出（LIFO）的原则。
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
任务队列分为宏任务（Macro Task）和微任务（Micro Task）。

1. **宏任务**
   - setTimeout
   - setInterval
   - setImmediate (Node.js)
   - requestAnimationFrame (浏览器)
   - I/O
   - UI rendering (浏览器)

2. **微任务**
   - Promise.then/catch/finally
   - process.nextTick (Node.js)
   - MutationObserver (浏览器)
   - queueMicrotask

#### 事件循环过程
1. 执行同步代码（执行栈）
2. 执行栈为空时，检查微任务队列
3. 执行所有微任务
4. 执行一个宏任务
5. 重复步骤2-4

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
1. **基本执行顺序**
```js
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1, 4, 3, 2
```

2. **嵌套Promise**
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

3. **setTimeout和Promise**
```js
setTimeout(() => {
  console.log('1');
}, 0);

Promise.resolve().then(() => {
  console.log('2');
});

// 输出顺序：2, 1
```

4. **async/await**
```js
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}

async function async2() {
  console.log('3');
}

console.log('4');
async1();
console.log('5');

// 输出顺序：4, 1, 3, 5, 2
```

#### 浏览器和Node.js的区别
1. **浏览器环境**
   - 宏任务：setTimeout, setInterval, requestAnimationFrame, I/O, UI rendering
   - 微任务：Promise, MutationObserver, queueMicrotask

2. **Node.js环境**
   - 宏任务：setTimeout, setInterval, setImmediate, I/O
   - 微任务：Promise, process.nextTick

```js
// Node.js环境
setImmediate(() => {
  console.log('1');
});

setTimeout(() => {
  console.log('2');
}, 0);

// 输出顺序可能不同，取决于系统性能
```

#### 最佳实践
1. 使用Promise处理异步操作
2. 避免过深的回调嵌套
3. 合理使用async/await
4. 注意setTimeout的延迟时间
5. 避免阻塞主线程
6. 使用Web Workers处理复杂计算
7. 使用requestAnimationFrame处理动画
8. 使用MutationObserver监听DOM变化
9. 使用queueMicrotask添加微任务
10. 使用process.nextTick添加微任务（Node.js） 