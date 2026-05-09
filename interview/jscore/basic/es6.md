---
title: ES6 新特性深度剖析
description: ES6 变量声明、Promise 静态方法、async/await 本质、Iterator/Generator 应用、ESM vs CJS 差异
---

### ES6 新特性
ES6（ECMAScript 2015）引入了许多新的语言特性，使JavaScript更加强大和易用。

#### 1. 变量声明
ES6 引入了块级作用域的声明方式，解决了 `var` 带来的变量提升和全局污染问题。
- **let**：用于声明可变变量，受块级作用域约束。
- **const**：用于声明常量，受块级作用域约束，必须初始化，且引用地址不可变。
- **注意**：`const` 声明的对象/数组，内部属性可修改，但不可重新赋值整个引用。

1. **let 和 const**
```js
// let 声明变量
let x = 1;
x = 2; // 可以重新赋值

// const 声明常量
const y = 1;
y = 2; // 错误：Assignment to constant variable
```

2. **块级作用域**
```js
{
  let x = 1;
  const y = 2;
}
console.log(x); // 错误：x is not defined
```

#### 2. 箭头函数
语法更简洁的函数定义方式。
- **特性**：不绑定自己的 `this`，继承外层上下文的 `this`。
- **限制**：不能作为构造函数（new），没有 `arguments` 对象，没有 `prototype` 属性，不可使用 `yield`。

1. **基本语法**
```js
// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;
```

2. **this 绑定**
```js
const obj = {
  name: 'John',
  sayHello: function() {
    setTimeout(() => {
      // 这里的 this 自动指向 obj
      console.log(`Hello, ${this.name}`);
    }, 100);
  }
};
```

#### 3. 解构赋值
一种从数组或对象中提取数据的优雅语法。
- **场景**：交换变量、提取接口返回值、函数参数默认值。
- **注意**：解构时可设置默认值，如 `const { name = 'Guest' } = {}`。

1. **数组解构**
```js
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
console.log(rest); // [3, 4, 5]
```

2. **对象解构**
```js
const { name, age, ...other } = { name: 'John', age: 30, city: 'New York' };
console.log(name); // 'John'
console.log(age); // 30
console.log(other); // { city: 'New York' }

// 重命名
const { foo: f, bar: b } = { foo: 'a', bar: 'b' }
console.log(f) // 'a'
console.log(b) // 'b'

// 嵌套解构 比如接口返回值是 res.data.data
const {data: {data}} = res
```

#### 4. 模板字符串
增强版的字符串，支持多行文本和嵌入变量。
- **语法**：使用反引号 `` ` `` 包裹，变量使用 `${}`。

```js
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
```

#### 5. 展开运算符与剩余参数
`...` 运算符，用于将数组或对象展开为逗号分隔的序列。
- **Spread（展开）**：合并数组/对象、复制数组/对象（浅拷贝）。
- **Rest（剩余）**：用于函数不定参数，替代 `arguments`。

1. **数组展开**
```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // [1, 2, 3, 4, 5]
```

2. **对象展开**
```js
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // { a: 1, b: 2, c: 3 }
```

3. **剩余参数**
```js
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

#### 6. 类 (Class)
基于原型的继承的语法糖，写法更接近传统面向对象语言。
- **constructor**：构造函数。
- **static**：静态方法。
- **super**：调用父类。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // babel编译后可以看到，sayHello方法会添加到原型上
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

const person = new Person('John', 30);
person.sayHello(); // Hello, my name is John
```

#### 7. 模块化 (Module)
ES6 原生支持的模块系统.
- **export**：导出模块接口（命名导出、默认导出）。
- **import**：引入其他模块提供的接口。

1. **导出**
```js
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default class Calculator {}
```

2. **导入**
```js
// main.js
import Calculator, { add, subtract } from './math.js';
```

#### 8. Promise
用于处理异步操作的对象，解决了回调地狱问题。
- **状态**：pending -> fulfilled / rejected（状态不可逆）。
- **链式调用**：`.then()` 返回新的 Promise。
- **静态方法**：`Promise.all`、`Promise.race`、`Promise.allSettled` 等。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

#### 9. 迭代器和生成器
- **Iterator**：一种接口机制，为各种数据结构提供统一的访问机制（`for...of`）。
- **Generator**：函数内部使用 `yield` 暂停执行，返回遍历器对象。

1. **迭代器**
```js
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
```

2. **生成器**
```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
```

#### 10. 新的数据结构
- **Set**：成员唯一（去重）的集合。
- **Map**：键值对集合，键可以是任意类型（包括对象）。
- **WeakMap/WeakSet**：弱引用版本，键必须是对象，不计入垃圾回收，防止内存泄漏。

1. **Symbol**
唯一标识符，常用于定义对象的唯一属性名。
- **注意**：即使描述相同，每次创建的 Symbol 也不相等。

```js
const sym = Symbol('description');
console.log(sym); // Symbol(description)
```

2. **Map**
```js
const map = new Map();
map.set('key', 'value');
console.log(map.get('key')); // 'value'
```

3. **Set**
```js
const set = new Set([1, 2, 3, 3]);
console.log(set); // Set { 1, 2, 3 }
```

#### 11. 新的数组方法
ES6 新增的数组方法，简化数组操作。

1. **map**
返回新数组，每个元素映射为回调函数的返回值。

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

2. **filter**
返回新数组，包含所有通过测试的元素。

```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]
```

3. **reduce**
将数组元素累计计算为一个值。

```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### 12. 新的对象方法

1. **Object.assign**
用于合并对象（浅拷贝）。后续对象会覆盖前面同名属性。

```js
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = Object.assign({}, obj1, obj2);
console.log(obj3); // { a: 1, b: 2 }
```

2. **Object.entries**
返回对象自身可枚举属性的键值对数组。

```js
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
```

3. **Object.is**
比较两个值是否严格相等，解决了 `NaN === NaN` 为 false、`+0 === -0` 为 true 的问题。

```js
Object.is(NaN, NaN); // true
Object.is(+0, -0);   // false
```

#### 最佳实践
1. **拥抱 const/let**：彻底抛弃 `var`。
2. **巧用解构**：让代码更 clean，提取参数更方便。
3. **箭头函数优先**：除了需要动态 `this` 的场合（如对象方法、原型方法、事件回调需要指向元素本身时），尽量使用箭头函数。
4. **使用 Class**：在需要面向对象编程时，优先使用 Class 而不是构造函数+原型链。
5. **善用 Map/Set**：处理频繁增删键值对或去重场景，性能优于 Object/Array。
6. **模板字符串**：拼接字符串时首选。
7. **模块化**：坚持使用 `import/export`，避免全局污染。

---

## 高频追问与深层原理

### Promise 静态方法的实现细节

#### Promise.all：任一失败则整体失败

```js
Promise.myAll = function(promises) {
  const results = new Array(promises.length)
  let completed = 0

  return new Promise((resolve, reject) => {
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = value
          if (++completed === promises.length) {
            resolve(results)
          }
        })
        .catch(reject) // 任一 reject 立即 reject
    })
  })
}

// 测试
Promise.myAll([
  Promise.resolve(1),
  new Promise(r => setTimeout(() => r(2), 100)),
  Promise.resolve(3)
]).then(console.log) // [1, 2, 3] (等待最慢的)
```

#### Promise.allSettled：全部完成才 resolve

```js
Promise.myAllSettled = function(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p)
        .then(
          value => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected', reason })
        )
    )
  )
}

// 使用场景：即使部分请求失败，也想知道成功的结果
Promise.myAllSettled([
  fetch('/api/user'),
  fetch('/api/config') // 即使失败，user 数据仍可用
]).then(results => {
  const [user, config] = results
  if (user.status === 'fulfilled') {
    console.log(user.value)
  }
})
```

#### Promise.race：谁先完成返回谁

```js
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p)
        .then(resolve)
        .catch(reject)
    })
  })
}

// 应用：请求超时
const requestWithTimeout = (url, timeout = 5000) => {
  return Promise.myRace([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}
```

---

### async/await 本质：Generator + 自动执行器

#### async 是 Generator 的语法糖

```js
// async 函数
async function fetchData() {
  const result = await fetch('/api/data')
  return result
}

// Babel 转译后大概等价于：
function fetchData() {
  return spawn(function* () {
    const result = yield fetch('/api/data')
    return result
  })
}
```

#### 自动执行器 spawn 的实现

```js
function spawn(gen) {
  return new Promise((resolve, reject) => {
    const iterator = gen()

    function step(nextValue) {
      let result
      try {
        result = iterator.next(nextValue)
      } catch (e) {
        return reject(e)
      }

      if (result.done) {
        return resolve(result.value)
      }

      // 递归调用，保持 Promise 链
      Promise.resolve(result.value)
        .then(step)
        .catch(err => iterator.throw(err))
    }

    step()
  })
}
```

#### async/await 的常见陷阱

```js
// 陷阱1：并行 vs 串行
async function loadData() {
  const a = await fetchA() // 必须等 a 完成
  const b = await fetchB() // 串行，总耗时 = a + b
}

// 正确并行：
async function loadData() {
  const [a, b] = await Promise.all([fetchA(), fetchB()])
}

// 陷阱2：循环中的 await
async function processItems(items) {
  const results = []
  for (const item of items) {
    results.push(await process(item)) // 串行
  }
  return results
}

// 正确并行：
async function processItems(items) {
  return Promise.all(items.map(process))
}
```

---

### Iterator / Generator 的实际业务应用

#### 1. 实现无限序列

```js
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a
    [a, b] = [b, a + b]
  }
}

const fib = fibonacci()
fib.next().value // 0
fib.next().value // 1
fib.next().value // 1
fib.next().value // 2
```

#### 2. 实现惰性计算

```js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

const numbers = range(1, 1000000)

// 不像 [1, 2, ..., 1000000] 占用大量内存
// range 生成器只存储当前状态
```

#### 3. 异步迭代器（用于 async await）

```js
async function* fetchPages(url) {
  let page = 1
  while (true) {
    const data = await fetch(`${url}?page=${page}`)
    if (data.length === 0) break
    yield data
    page++
  }
}

// 使用
for await (const pageData of fetchPages('/api/list')) {
  console.log(pageData)
}
```

---

### ES Module vs CommonJS：运行时差异

#### 加载顺序不同

```js
// ESM - 提升，但依赖关系静态分析
import { a } from './module' // 必须在文件顶部

// CJS - 运行时加载
const { a } = require('./module') // 可以在任何位置
```

#### 值拷贝 vs 引用

```js
// CJS - 输出的是值的拷贝
// counter.js
let count = 0
exports.count = count
exports.increment = () => { count++ }

// main.js
const { count, increment } = require('./counter')
console.log(count) // 0
increment()
console.log(count) // 仍然是 0！

// ESM - 输出的是引用（只读）
// counter.mjs
let count = 0
export { count }
export const increment = () => { count++ }

// main.mjs
import { count, increment } from './counter.mjs'
console.log(count) // 0
increment()
console.log(count) // 1 - count 变化了（因为是引用）
```

#### 循环引用处理

```js
// a.js
import { b } from './b.js'
export const a = 'a'
export function getA() { return a + b }

// b.js
import { a } from './a.js'
export const b = 'b'
export function getB() { return a + b }

// ESM 允许循环引用，但可能得到未完全初始化的值
const bModule = require('./b.js')
const aModule = require('./a.js')
// 两个模块都能正常导出
```

---

### import() 动态导入与 Code Splitting

动态 `import()` 返回 Promise，是实现 Code Splitting 的关键。

#### 基本用法

```js
// 静态导入
import { multiply } from './utils.js'

// 动态导入
const module = await import('./utils.js')
module.multiply(2, 3)

// 用于 Code Splitting
button.addEventListener('click', async () => {
  const { multiply } = await import('./utils.js')
  multiply(2, 3)
})
```

#### Vite 中的实现

```js
// Vite 会将动态 import 转换为独立的 chunk
// 点击按钮前，./utils.js 不会下载

// vite build 产物：
// main.js           - 主bundle
// assets/utils.[hash].js  - 懒加载chunk
```

#### React.lazy + dynamic import

```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

// 只有 HeavyComponent 被渲染时，才会加载对应的 chunk
```

---

## 面试回答模板

**问题**：async/await 和 Promise 的关系？

**高分回答**：

> `async/await` 是 Promise 的语法糖，让异步代码看起来像同步代码。
>
> `async` 函数被调用时返回一个 Promise，函数内部的 `await` 会暂停函数执行，等待 Promise resolve 后继续。
>
> 底层实现上，`async` 函数被转译为 Generator + 自动执行器。每次 `await` 都会 yield 一个 Promise，自动执行器负责递归调用 `.then()` 保持 Promise 链。
>
> **常见陷阱**：在循环中使用 `await` 会变成串行，应该用 `Promise.all` 并行处理。

---

## 相关链接

- [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN Iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
- [ES Module 规范](https://tc39.es/ecma262/#sec-modules)
