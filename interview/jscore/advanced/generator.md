# Generator 生成器

## 1. 基本概念

Generator 函数是 ES6 提供的一种异步编程解决方案。执行 Generator 函数会返回一个遍历器对象（Iterator），也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。

### 语法特征
1. `function` 关键字与函数名之间有一个星号 `*`。
2. 函数体内部使用 `yield` 表达式，定义不同的内部状态。

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
// 执行后不会立即运行，而是返回一个指向内部状态的指针对象
console.log(hw.next()); // { value: 'hello', done: false }
console.log(hw.next()); // { value: 'world', done: false }
console.log(hw.next()); // { value: 'ending', done: true }
console.log(hw.next()); // { value: undefined, done: true }
```

## 2. 核心方法：next()

`next()` 方法可以带一个参数，该参数会被当作**上一个 `yield` 表达式的返回值**。这使得我们可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next(12) // Object{value:8, done:false} 
// 解析：yield (x + 1) 的返回值被设为 12，所以 y = 2 * 12 = 24。yield(y/3) => yield(8)
a.next(13) // Object{value:42, done:true}
// 解析：yield (y / 3) 的返回值被设为 13，所以 z = 13。return 5 + 24 + 13 = 42
```

## 3. 协程（Coroutine）

Generator 函数是 ES6 对协程的实现。
- **协程**：一种比线程更加轻量级的存在。普通函数执行是一杆子到底，协程可以执行一半暂停（yield），将执行权交给其他协程，待条件满足后再恢复执行（next）。
- **优势**：在单线程 JS 中实现了非阻塞的逻辑控制。

## 4. 应用场景

### 控制流管理
避免回调地狱，虽然现在多用 async/await，但 Generator 是其底层基础。

### 部署 Iterator 接口
利用 Generator 函数，可以在任意对象上快速部署 Iterator 接口。

### Redux-Saga
React 生态中著名的中间件 Redux-Saga 广泛使用 Generator 来处理 Side Effects（副作用，如异步请求）。

