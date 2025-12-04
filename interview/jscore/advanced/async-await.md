# Async/Await

## 1. 概念

`async/await` 是 ES2017 引入的异步编程标准，被誉为异步编程的“终极解决方案”。它本质上是 **Generator 函数的语法糖**。

*   `async`：表示函数内部有异步操作，返回一个 Promise。
*   `await`：表示紧跟在后面的表达式需要等待结果。

## 2. 相比 Promise 的优势

1.  **代码更像同步代码**：阅读和理解逻辑更符合人类思维，避免了 Promise 链式调用 (`.then().then()`) 带来的视觉干扰。
2.  **更好的错误处理**：可以使用成熟的 `try...catch` 结构处理同步和异步错误，而 Promise 需要用 `.catch`。
3.  **中间值处理**：在 Promise 链中，如果后续 `.then` 需要用到前面某个 `.then` 的结果，通常需要通过变量提升或嵌套传递，`async/await` 像同步代码一样定义变量即可。

## 3. 实现原理（面试重点）

**Async/Await = Generator + 自动执行器**

Generator 函数需要手动调用 `next()` 才能一步步执行，如果有一个函数能自动调用 `next()`，直到 `done: true`，那就是 `async` 函数了。

```javascript
// 简易版自动执行器（spawn）
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      
      if(next.done) {
        return resolve(next.value);
      }
      
      // 递归自动执行
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    
    step(function() { return gen.next(undefined); });
  });
}
```

## 4. 常见坑点：串行与并行

**错误示范（串行，效率低）**：
```javascript
async function foo() {
  // 只有等 getA 完成，才会开始 getB
  let a = await getA(); 
  let b = await getB();
}
```

**正确示范（并行，效率高）**：
```javascript
async function foo() {
  // 两个请求同时发出
  let [a, b] = await Promise.all([getA(), getB()]);
}
```
或者：
```javascript
async function foo() {
    let aPromise = getA();
    let bPromise = getB();
    // 此时两个请求已经发出去了
    let a = await aPromise;
    let b = await bPromise;
}
```

