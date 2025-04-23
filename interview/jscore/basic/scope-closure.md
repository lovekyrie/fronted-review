### 作用域 (Scope)
作用域是指程序源代码中定义变量的区域，它规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

#### 作用域类型
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

console.log(functionVar); // 报错：functionVar is not defined
```

3. **块级作用域 (Block Scope)**
```js
{
  // 块级作用域
  let blockLet = 'block';
  const blockConst = 'block';
  var blockVar = 'block'; // var 没有块级作用域
}

console.log(blockLet); // 报错：blockLet is not defined
console.log(blockVar); // 可以访问，因为var没有块级作用域
```

### 作用域链 (Scope Chain)
作用域链是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的访问。

#### 作用域链的创建过程
1. 创建全局执行上下文，压入执行栈
2. 创建函数执行上下文，压入执行栈
3. 函数执行上下文创建时，会创建作用域链
4. 作用域链的前端是当前执行上下文的变量对象
5. 作用域链的后端是外部执行上下文的变量对象
6. 作用域链的末端是全局执行上下文的变量对象

```js
var globalVar = 'global';

function outer() {
  var outerVar = 'outer';
  
  function inner() {
    var innerVar = 'inner';
    console.log(innerVar); // 可以访问
    console.log(outerVar); // 可以访问
    console.log(globalVar); // 可以访问
  }
  
  inner();
}

outer();
```

### 变量提升 (Hoisting)
JavaScript 中，变量和函数的声明会被提升到作用域的顶部。

#### var 的变量提升
```js
console.log(hoistedVar); // undefined
var hoistedVar = 'hoisted';

// 等价于
var hoistedVar;
console.log(hoistedVar); // undefined
hoistedVar = 'hoisted';
```

#### let 和 const 的变量提升
```js
console.log(hoistedLet); // 报错：Cannot access 'hoistedLet' before initialization
let hoistedLet = 'hoisted';

// let 和 const 存在暂时性死区（Temporal Dead Zone）
```

### 闭包 (Closure)
闭包是指有权访问另一个函数作用域中的变量的函数。

#### 闭包的基本使用
```js
function createCounter() {
  let count = 0;
  
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
1. **数据私有化**
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

2. **函数工厂**
```js
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(3)); // 6
```

### 常见面试题
1. **变量提升和暂时性死区**
```js
console.log(a); // undefined
var a = 1;

console.log(b); // 报错：Cannot access 'b' before initialization
let b = 2;
```

2. **闭包中的变量**
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

// 解决方案2：使用闭包
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // 输出0,1,2,3,4
    }, 0);
  })(i);
}
```

3. **作用域链查找**
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
1. 尽量使用`let`和`const`声明变量，避免使用`var`
2. 合理使用闭包，注意内存泄漏问题
3. 避免在全局作用域中声明变量
4. 使用立即执行函数表达式（IIFE）创建独立作用域
5. 注意变量提升和暂时性死区的影响