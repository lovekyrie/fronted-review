---
title: 作用域、闭包与内存管理
description: JavaScript 作用域链、变量提升、闭包原理、模块模式与内存泄漏场景
---

### 作用域 (Scope)
作用域是指程序源代码中定义变量的区域，它规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

#### 作用域类型
JavaScript 主要有三种作用域：
1. **全局作用域**：在代码任何地方都能访问，生命周期贯穿整个应用。
2. **函数作用域**：函数内部定义的变量，外部无法访问。
3. **块级作用域**（ES6+）：由 `{}` 包裹的区域（如 if/for/switch），仅 `let/const` 遵循此规则。

1. **全局作用域 (Global Scope)**

```js
// 全局作用域
var globalVar = 'global';
let globalLet = 'global';
const globalConst = 'global';

function globalFunc() {
  console.log(globalVar); // 可以访问
}
```

2. **函数作用域 (Function Scope)**

```js
function functionScope() {
  // 函数作用域
  var functionVar = 'function';
  let functionLet = 'function';
  const functionConst = 'function';
  
  console.log(globalVar); // 可以访问全局变量
}

// console.log(functionVar); // 报错：functionVar is not defined
```

3. **块级作用域 (Block Scope)**

```js
{
  // 块级作用域
  let blockLet = 'block';
  const blockConst = 'block';
  var blockVar = 'block'; // var 没有块级作用域
}

// console.log(blockLet); // 报错：blockLet is not defined
console.log(blockVar); // 可以访问，因为var没有块级作用域
```

### 作用域链 (Scope Chain)
当查找变量时，JS 引擎会遵循“就近原则”：
1. 先在**当前作用域**查找。
2. 如果没找到，去**父级作用域**查找。
3. 一直向上直到**全局作用域**。
这种层层递进的关系链就是**作用域链**。
**关键点**：作用域链在**函数定义时**就已经确定了（词法作用域），而不是调用时。

#### 作用域链的创建过程
（此部分涉及执行上下文，通常只需记住词法作用域规则即可）

```js
var globalVar = 'global';

function outer() {
  var outerVar = 'outer';
  
  function inner() {
    var innerVar = 'inner';
    console.log(innerVar); // inner
    console.log(outerVar); // outer (向上查找到 outer)
    console.log(globalVar); // global (向上查找到 global)
  }
  
  inner();
}

outer();
```

### 变量提升 (Hoisting)
JS 引擎在执行代码前会先进行**预编译**，将变量和函数的声明移动到作用域顶部。

#### var 的变量提升
`var` 声明会被提升，但**初始化不会提升**。在赋值前访问会得到 `undefined`。

```js
console.log(hoistedVar); // undefined
var hoistedVar = 'hoisted';

// 等价于
// var hoistedVar;
// console.log(hoistedVar);
// hoistedVar = 'hoisted';
```

#### let 和 const 的变量提升
`let/const` 也会被提升，但处于**暂时性死区 (TDZ)**。在声明执行前访问会直接**报错**。

```js
// console.log(hoistedLet); // 报错：Cannot access 'hoistedLet' before initialization
let hoistedLet = 'hoisted';

// let 和 const 存在暂时性死区（Temporal Dead Zone）
```

### 闭包 (Closure)
**定义**：一个函数和对其周围状态（词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包。
**通俗理解**：内部函数引用了外部函数的变量，导致外部函数的变量无法被释放（即使外部函数已经执行完毕）。

#### 闭包的基本使用

```js
function createCounter() {
  let count = 0; // 这个变量被下方的对象引用了，不会被 GC 回收
  
  return {
    increment() {
      return ++count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
```

#### 闭包的应用场景
1. **数据私有化 (模拟私有属性)**
   通过闭包隐藏变量，只暴露操作接口。

```js
function createPerson(name) {
  let _name = name; // 私有变量
  
  return {
    getName() {
      return _name;
    },
    setName(newName) {
      _name = newName;
    }
  };
}

const person = createPerson('John');
console.log(person.getName()); // 'John'
console.log(person._name); // undefined
```

2. **函数工厂 / 柯里化 (Currying)**
   生成带有特定参数的函数。

```js
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2); // 记住了 x = 2
console.log(multiplyByTwo(3)); // 6
```

### 常见面试题
1. **变量提升和暂时性死区 (TDZ)**
   - `var` 会提升并初始化为 undefined。
   - `let/const` 会提升但进入 TDZ，访问即报错。

```js
console.log(a); // undefined
var a = 1;

// console.log(b); // 报错：Cannot access 'b' before initialization
let b = 2;
```

2. **闭包中的变量 (经典循环陷阱)**
   - **问题**：`var` 是函数作用域，循环结束时 `i` 变成了 5，定时器回调执行时引用的都是同一个 `i`。
   - **解决**：
     1. 使用 `let`（块级作用域，每次循环都是新的 `i`）。
     2. 使用 IIFE（立即执行函数）构造闭包来保存当前的 `i`。

```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 输出5个5
  }, 0);
}

// 解决方案1：使用let
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 输出0,1,2,3,4
  }, 0);
}

// 解决方案2：使用闭包 (IIFE)
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // 输出0,1,2,3,4
    }, 0);
  })(i);
}
```

3. **作用域链查找**
   - 内部函数 `inner` 定义了自己的 `a`，所以打印 3。
   - 如果注释掉 `inner` 里的 `var a = 3`，则会打印 `outer` 的 2。
   - 始终遵循“就近原则”。

```js
var a = 1;
function outer() {
  var a = 2;
  function inner() {
    var a = 3;
    console.log(a); // 3
  }
  inner();
}
outer();
```

### 最佳实践
1. **默认使用 `const`**：除非变量需要重新赋值，否则一律用 `const`。
2. **需要修改用 `let`**：循环变量或状态变量用 `let`。
3. **禁用 `var`**：避免变量提升和全局污染带来的 bug。
4. **警惕闭包内存泄漏**：如果闭包引用了大的 DOM 元素或对象，确保在不需要时手动置为 null 或移除事件监听。
5. **巧用 IIFE**：虽然模块化（ES Modules）已经普及，但在旧环境或特定场景下，IIFE 仍是隔离作用域的好帮手。

---

## 高频追问与深层原理

### 模块模式（Module Pattern）与数据私有化

模块模式利用闭包实现数据私有化，是 JavaScript 经典设计模式。

#### 基础模块模式

```js
const Counter = (function() {
  // 私有状态
  let count = 0

  // 私有方法
  function validate(value) {
    return typeof value === 'number' && value > 0
  }

  // 公共接口
  return {
    increment() {
      if (validate(count + 1)) {
        count++
      }
      return count
    },
    decrement() {
      if (validate(count - 1)) {
        count--
      }
      return count
    },
    getCount() {
      return count
    }
  }
})()

Counter.increment() // 1
Counter.increment() // 2
Counter.getCount()  // 2
Counter.count       // undefined - 私有变量无法直接访问
```

#### 揭示模块模式（Revealing Module Pattern）

```js
const RevealingCounter = (function() {
  let _count = 0

  function _increment() {
    _count++
    return _count
  }

  function _decrement() {
    _count--
    return _count
  }

  function _getCount() {
    return _count
  }

  // 揭示公共接口
  return {
    increment: _increment,
    decrement: _decrement,
    getCount: _getCount
  }
})()
```

#### 模块模式 vs ES6 模块

| 维度 | 模块模式 | ES6 模块 |
|------|----------|----------|
| 语法 | 函数闭包 | import/export |
| 静态分析 | 无法 | 可以（tree-shaking） |
| 运行时 | 每次调用创建新实例 | 单例 |
| 状态 | 可以多实例 | 全局单例 |
| 适用 | 复杂状态、工厂函数 | 标准模块化代码 |

---

### 闭包与 GC 的关系：内存泄漏场景

#### 为什么闭包会导致内存泄漏？

正常情况下，函数执行完毕后，作用域内的变量会被 GC 回收。但如果形成了闭包，外部函数作用域中的变量被内部函数引用，**GC 无法回收这些变量**。

#### 内存泄漏场景1：循环引用

```js
function createLeak() {
  const largeData = new Array(100000)

  // 虽然不再使用 largeData，但闭包引用了它
  const leak = function() {
    return largeData
  }

  // leak 存在，largeData 就无法被 GC
  return leak
}

const fn = createLeak()
// 即使 fn 不再需要，largeData 仍占据内存
fn = null // 必须手动置 null 才能释放
```

#### 内存泄漏场景2：DOM 事件监听

```js
class Listener {
  constructor() {
    this.element = document.getElementById('btn')
    this.data = new Array(100000)

    // 闭包引用了 this.data
    this.element.addEventListener('click', () => {
      console.log(this.data) // 闭包保持 data 存活
    })
  }

  // 错误：没有清理
  destroy() {
    // 只是移除监听，但没有解除对 this.data 的引用
    this.element.removeEventListener('click', this.handler)
  }
}
```

**正确做法**：

```js
class Listener {
  constructor() {
    this.element = document.getElementById('btn')
    this.data = new Array(100000)

    // 保存引用，以便移除
    this.handler = () => {
      console.log(this.data)
    }

    this.element.addEventListener('click', this.handler)
  }

  destroy() {
    this.element.removeEventListener('click', this.handler)
    this.element = null
    this.data = null
    this.handler = null
  }
}
```

#### 内存泄漏场景3：setTimeout + 闭包

```js
function process() {
  const largeData = new Array(100000)

  // 如果这个定时器从未被清理，largeData 永远无法释放
  setTimeout(function() {
    console.log(largeData) // 闭包保持 data 存活
  }, 60000) // 1分钟后才执行

  // 如果需要立即清理
  const timeoutId = setTimeout(...)
  clearTimeout(timeoutId)
}
```

---

### TDZ 深度追问：var vs function 提升优先级

#### 提升的规则

```js
// 代码实际执行顺序
console.log(foo) // function foo() { return 2 }
console.log(bar) // undefined

var foo = 1
function bar() { return 2 }
```

**提升后的实际结构**：

```js
// 1. 函数声明提升（完整提升）
function bar() { return 2 }

// 2. var 变量声明提升（初始化不提升）
var foo

// 3. 执行阶段
console.log(foo) // undefined - foo 已声明但未赋值
console.log(bar) // function - bar 已是完整函数

foo = 1
```

#### function 声明覆盖 var 声明

```js
var foo = 1

function foo() { return 2 }

// 结果：foo 是函数 2（function 声明会覆盖 var 声明）
console.log(typeof foo) // "function"
console.log(foo()) // 2
```

#### 条件 function 声明的行为

```js
// 旧版浏览器可能有问题
if (true) {
  function test() { return 1 }
} else {
  function test() { return 2 }
}

// 不同浏览器行为不同：
// Chrome: test = 2（最后定义的函数生效）
// Firefox: test = 1（else 中的函数不提升）
```

---

### try-catch 中的变量作用域

try-catch 中的变量是块级作用域：

```js
try {
  JSON.parse('{ invalid json }')
} catch (e) {
  // e 只在 catch 块内有效
  console.log(e) // SyntaxError: Unexpected token
}

// e 在这里不存在
console.log(e) // ReferenceError: e is not defined
```

#### try-catch 的性能考量

V8 会对 try-catch 进行优化，但要注意：

```js
// 错误：try-catch 内部返回函数会阻止 V8 优化
function badExample() {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

// 正确：提取到外部函数
function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

// V8 可以优化 parseJSON
function process() {
  return parseJSON(data)
}
```

---

## 面试回答模板

**问题**：闭包的原理和应用场景？

**高分回答**：

> 闭包是函数和其词法环境的组合。当内部函数引用了外部函数的变量，即使外部函数已经执行完毕，那些变量也不会被垃圾回收。
>
> **常见应用场景**：
> 1. **数据私有化**：模块模式只暴露必要接口
> 2. **函数工厂**：柯里化生成特定参数的函数
> 3. **回调函数**：保持对上下文的引用
>
> **潜在风险**：闭包会导致内存泄漏，因为被引用的变量无法被 GC 回收。常见场景是 DOM 事件监听器、定时器、或循环中的大对象。解决方案是手动置 null 或移除监听器。
>
> **追问**：var 和 let 在循环中的行为差异？
> - var 是函数作用域，循环变量是共享的
> - let 是块级作用域，每次循环都是新的变量
> - 这就是为什么循环中的 setTimeout 应该用 let 或 IIFE

---

## 相关链接

- [MDN 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [MDN 作用域](https://developer.mozilla.org/zh-CN/docs/Glossary/Scope)
- [V8 闭包优化](https://v8.dev/blog/closures)
- [Module Pattern 详解](https://addyosmani.com/resources/essentialjsdesignpatterns/ detail/#modulepatternjavascript
