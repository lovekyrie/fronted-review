### Promise 和异步编程
JavaScript中的异步编程主要通过Promise、async/await等方式实现。

#### Promise 基础
**Promise** 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。
它是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

1. **创建Promise**
```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('success'); // 状态变成 fulfilled
    } else {
      reject('error');    // 状态变成 rejected
    }
  }, 1000);
});
```

2. **Promise状态**
   - **pending**: 进行中。
   - **fulfilled**: 已成功（调用 resolve）。
   - **rejected**: 已失败（调用 reject）。
   *状态一旦改变，就不会再变。*

3. **Promise方法**
   - **then**: 状态变为 fulfilled 时回调。
   - **catch**: 状态变为 rejected 或发生错误时回调。
   - **finally**: 无论状态如何都会执行（常用于关闭 loading）。

```js
promise
  .then(result => {
    console.log(result); // 'success'
  })
  .catch(error => {
    console.error(error); // 'error'
  })
  .finally(() => {
    console.log('finally'); // 无论成功失败都会执行
  });
```

#### Promise 链式调用
解决回调地狱（Callback Hell）的关键。`then` 方法返回一个新的 Promise，可以将异步操作串联起来。
- **返回值**：如果在 `then` 中返回一个值，它会作为下一个 `then` 的参数；如果返回一个 Promise，下一个 `then` 会等待这个 Promise 结束。

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return fetch('https://api.example.com/other-data');
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Promise 静态方法
1. **Promise.all**
   - **并发执行**：将多个 Promise 实例包装成一个新的 Promise。
   - **成功**：只有数组中所有 Promise 都成功，才算成功（返回数组）。
   - **失败**：只要有一个失败，就立刻失败（返回那个失败的原因）。

```js
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });
```

2. **Promise.race**
   - **赛跑**：数组中哪个 Promise 先改变状态（无论成功或失败），新的 Promise 就跟着改变。
   - **场景**：请求超时控制（一个请求，一个定时器，谁快听谁的）。

```js
const promises = [
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500))
];

Promise.race(promises)
  .then(result => {
    console.log(result); // 2
  });
```

3. **Promise.allSettled** (ES2020)
   - **等待所有**：不管成功失败，都等所有 Promise 结束。
   - **返回**：包含每个 Promise 状态和结果的对象数组。

```js
const promises = [
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
];

Promise.allSettled(promises)
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 3 }
    // ]
  });
```

#### async/await
基于 Generator 和 Promise 的语法糖，让异步代码写起来像同步代码。
- **async**：声明一个异步函数，自动返回 Promise。
- **await**：暂停代码执行，等待 Promise 解决，并返回 resolve 的值。

1. **基本使用**
```js
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

2. **并行请求**
   - **注意**：不要在循环中 await（那是串行），应该先创建 Promise 数组然后 Promise.all。

```js
async function fetchMultipleData() {
  try {
    // 效率高：并行发起
    const [data1, data2] = await Promise.all([
      fetch('https://api.example.com/data1').then(r => r.json()),
      fetch('https://api.example.com/data2').then(r => r.json())
    ]);
    console.log(data1, data2);
  } catch (error) {
    console.error(error);
  }
}
```

#### 常见面试题
1. **Promise实现 (简易版)**
   - 核心：维护状态、值、回调数组。
   - `then`：根据状态执行回调或放入回调数组。

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback(value));
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    } else if (this.state === 'rejected') {
      onRejected(this.reason);
    } else {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
    return this;
  }
}
```

2. **async/await 原理**
   - 它是 Generator 的语法糖，内置了执行器（Executor）。
   - 自动调用 generator.next()，如果 yield 后是 Promise，则等其 resolve 后再调用 next。

#### 最佳实践
1. **统一 catch**：在 Promise 链的末尾加一个 catch，或使用 try/catch 包裹 async/await，防止 unhandledrejection。
2. **避免串行 await**：如果是无依赖的请求，尽量使用 `Promise.all` 并发。
3. **Promise.resolve/reject**：快速创建 Promise 用于测试或返回值归一化。
4. **清理副作用**：使用 `finally` 关闭 loading 状态或释放资源。 