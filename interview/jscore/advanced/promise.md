# Promise 详解

## 1. 核心概念

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 `Promise` 对象。

### 三种状态
Promise 对象代表一个异步操作，有三种状态：
- **Pending（进行中）**：初始状态，不是成功或失败。
- **Fulfilled（已成功）**：意味着操作成功完成。
- **Rejected（已失败）**：意味着操作失败。

**特点**：
1. 对象的状态不受外界影响。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。状态改变只有两种可能：`Pending -> Fulfilled` 或 `Pending -> Rejected`。

## 2. 基本用法

```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

## 3. 静态方法

*   **Promise.all(iterable)**: 只有当所有 Promise 都成功时才成功，返回结果数组；只要有一个失败就直接失败。
*   **Promise.race(iterable)**: 赛跑机制，哪个 Promise 最快改变状态，结果就跟着改变（无论成功失败）。
*   **Promise.allSettled(iterable)**: ES2020 新增。等到所有 Promise 都结束（不管成功失败），返回一个包含每个结果对象的数组。
*   **Promise.resolve(value)**: 返回一个以给定值解析后的 Promise 对象。
*   **Promise.reject(reason)**: 返回一个带有拒绝原因的 Promise 对象。

## 4. 常见面试题：手写简易 Promise

面试中通常不需要写出符合 Promise/A+ 规范的完整代码，但需要掌握核心逻辑（状态管理、回调存储）。

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

        if (this.state === 'fulfilled') {
            onFulfilled(this.value);
        }
        
        if (this.state === 'rejected') {
            onRejected(this.reason);
        }

        if (this.state === 'pending') {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
}
```

## 5. 考点：值穿透

```javascript
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```
**输出**：`1`
**解析**：`.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值穿透。

## 6. 常见 API 细节（高频追问）

### 6.1 then / catch / finally 的关系

- `catch(fn)` 本质是 `then(undefined, fn)`。
- `finally(fn)` 不接收上一个结果值，它只用于“收尾动作”（如关闭 loading）。
- `finally` 会把之前的结果“透传”下去，除非 `finally` 内抛错或返回 rejected Promise。

```js
Promise.resolve('ok')
  .finally(() => {
    console.log('cleanup');
  })
  .then((res) => console.log(res)); // 'ok'
```

### 6.2 Promise executor 是同步执行

```js
console.log('A');
new Promise((resolve) => {
  console.log('B'); // 同步执行
  resolve();
}).then(() => console.log('C'));
console.log('D');
// 输出：A B D C
```

## 7. 面试常见陷阱题

### 7.1 错误不会被 catch 到的场景

异步回调里抛错，不一定会被外层 Promise 的 `catch` 捕获，需要把异步操作 Promise 化。

### 7.2 Promise 链中漏写 return

```js
Promise.resolve(1)
  .then((n) => {
    Promise.resolve(n + 1); // 漏了 return
  })
  .then((n) => console.log(n)); // undefined
```

## 8. 如何回答“手写 Promise”更稳

面试中不一定要求完整实现 A+，但至少要说清：

1. 状态机（`pending` 只允许一次流转）。
2. 回调队列（处理异步 resolve 时的 then 注册）。
3. then 返回新 Promise（支持链式调用）。
4. 错误穿透与异常捕获（`try/catch` 包裹执行逻辑）。

