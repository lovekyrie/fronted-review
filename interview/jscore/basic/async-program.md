### Promise 和异步编程
JavaScript中的异步编程主要通过Promise、async/await等方式实现。

#### Promise 基础
Promise是一个表示异步操作最终完成或失败的对象。

1. **创建Promise**
```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('success');
    } else {
      reject('error');
    }
  }, 1000);
});
```

2. **Promise状态**
   - pending: 初始状态，既不是成功，也不是失败
   - fulfilled: 操作成功完成
   - rejected: 操作失败

3. **Promise方法**
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
Promise支持链式调用，可以处理多个异步操作。
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

3. **Promise.allSettled**
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
async/await是Promise的语法糖，使异步代码看起来像同步代码。

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
```js
async function fetchMultipleData() {
  try {
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
1. **Promise实现**
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

2. **async/await实现**
```js
async function example() {
  try {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success');
      }, 1000);
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

#### 最佳实践
1. 使用Promise处理异步操作
2. 使用async/await简化异步代码
3. 合理使用Promise.all和Promise.race
4. 正确处理错误和异常
5. 避免Promise地狱
6. 使用try/catch处理async/await错误
7. 使用Promise.allSettled处理多个Promise
8. 使用Promise.any处理多个Promise中的第一个成功结果
9. 使用Promise.finally处理清理工作
10. 使用Promise.resolve和Promise.reject创建Promise 