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