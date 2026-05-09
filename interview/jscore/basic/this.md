---
title: this 指向与绑定机制
description: JavaScript this 的四种绑定方式、丢失场景、软绑定原理与框架中的 this 处理
---

### this 指向
在JavaScript中，`this`是一个特殊的关键字，它的指向取决于函数的调用方式。

#### 默认绑定
在非严格模式下，当独立调用函数（fun()）时，`this` 默认指向全局对象。

```js
function foo() {
  console.log(this);
}

foo(); // window/global
```

在严格模式（`'use strict'`）下，`this` 会绑定到 `undefined`，避免了意外修改全局变量的风险。
```js
'use strict';
function foo() {
  console.log(this);
}

foo(); // undefined
```

#### 隐式绑定
当函数作为某个对象的方法被调用时，`this` 会隐式绑定到那个上下文对象。  
**注意**：隐式绑定容易“丢失绑定”，即当方法被赋值给变量或作为回调传递时，会退回到默认绑定（全局或 undefined）。

```js
const obj = {
  name: 'John',
  foo() {
    console.log(this.name);
  }
};

obj.foo(); // 'John'
```

**注意**：当函数被赋值给变量时，会丢失`this`的指向。

```js
const obj = {
  name: 'John',
  foo() {
    console.log(this.name);
  }
};

const bar = obj.foo;
bar(); // undefined
```

#### 显式绑定
通过 `call`、`apply` 或 `bind` 方法，我们可以强制指定函数执行时的 `this`，这称为显式绑定。
- **call/apply**：立即执行函数，区别仅在于参数传递方式（参数列表 vs 数组）。
- **bind**：返回一个新的包装函数，永久锁定 `this`，等待稍后调用。

1. **call方法**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
foo.call(obj); // 'John'
```

2. **apply方法**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
foo.apply(obj); // 'John'
```

3. **bind方法**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
const bar = foo.bind(obj);
bar(); // 'John'
```

#### new绑定
当使用 `new` 关键字调用构造函数时，会发生以下步骤：
1. 创建一个全新的对象。
2. 执行 `[[Prototype]]` 连接。
3. 将函数调用的 `this` 绑定到这个新对象。
4. 如果函数没有返回其他对象，则自动返回这个新对象。

```js
function Person(name) {
  this.name = name;
}

const person = new Person('John');
console.log(person.name); // 'John'
```

#### 箭头函数
箭头函数不绑定自己的 `this`，它会“捕获”定义时所在外层作用域（词法作用域）的 `this`。
**特点**：箭头函数的 `this` 无法通过 call/apply/bind 修改，非常适合用作回调函数（如定时器、事件监听）。

```js
const obj = {
  name: 'John',
  foo() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  }
};

obj.foo(); // 'John'
```

### 常见面试题
1. **this指向问题**
```js
const obj = {
  name: 'John',
  foo() {
    console.log(this.name);
  }
};

const bar = obj.foo;
bar(); // undefined
```

2. **箭头函数的this**
```js
const obj = {
  name: 'John',
  foo() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  }
};

obj.foo(); // 'John'
```

3. **构造函数中的this**
```js
function Person(name) {
  this.name = name;
  this.foo = function() {
    console.log(this.name);
  };
}

const person = new Person('John');
person.foo(); // 'John'
```

### 最佳实践
1. **优先使用箭头函数**：在回调函数中（如定时器、数组方法、Promise），优先使用箭头函数来自动捕获外层的 `this`，避免 `self = this` 这种过时的写法。
2. **显式绑定兜底**：如果不确定上下文，使用 `bind` 明确绑定 `this`。
3. **类方法绑定**：在 React 类组件或普通 ES6 类中，如果方法需要作为回调传递，记得在构造函数中 bind 或直接定义为箭头函数属性。

```js
class User {
  constructor(name) {
    this.name = name;
  }

  // 错误示例：使用普通函数
  fetchUserData() {
    fetch('/api/user')
      .then(function(response) {
        // 这里的 this 指向 window 或 undefined
        console.log(this.name); // 报错：Cannot read property 'name' of undefined
      });
  }
}
```

```js
class User {
  constructor(name) {
    this.name = name;
  }

  // 正确示例：使用箭头函数
  fetchUserData() {
    fetch('/api/user')
      .then((response) => {
        // 箭头函数保持 this 指向 User 实例
        console.log(this.name); // 正确输出：用户名称
      });
  }

  // 另一个例子：事件处理
  setupEventListeners() {
    document.getElementById('button')
      .addEventListener('click', () => {
        // 箭头函数保持 this 指向 User 实例
        this.handleClick();
      });
  }

  handleClick() {
    console.log(`Hello, ${this.name}!`);
  }
}

// 使用示例
const user = new User('John');
user.fetchUserData();
user.setupEventListeners();
``` 

### 进阶补充：this 绑定优先级与易错点

#### 绑定优先级（面试高频）

当同一个函数可能触发多种绑定方式时，优先级如下：

1. `new` 绑定
2. 显式绑定（`call/apply/bind`）
3. 隐式绑定（对象调用）
4. 默认绑定（独立调用）

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'obj' };
const bar = foo.bind(obj);
const baz = new bar();

console.log(baz.name); // undefined（new 绑定优先，this 指向新对象）
```

#### 显式绑定失效场景

- `bind` 返回的新函数被 `new` 调用时，`bind` 绑定的 `this` 会被忽略。
- 箭头函数无法通过 `call/apply/bind` 改变 `this`。

```js
const obj = { name: 'obj' };
const arrow = () => console.log(this?.name);
arrow.call(obj); // 仍然是定义时外层 this，不会变成 obj
```

#### 实战建议（补充）

1. 作为回调传递的方法，优先在定义处解决 `this`（箭头函数或提前 `bind`）。
2. 对外暴露 API 时避免依赖隐式绑定，减少调用方误用概率。
3. 面试回答建议按”规则 -> 例子 -> 反例（易错点）”结构讲，更容易拿分。

---

## 深层原理与高频追问

### 软绑定（softBind）的实现原理

`bind` 的问题是：如果用 `new` 调用，会忽略硬绑定的 `this`。软绑定提供了解决方案——如果 `this` 被 `new` 调用，返回的仍是新对象，但普通调用会绑定到指定对象。

```js
Function.prototype.softBind = function(obj) {
  const fn = this
  const params = Array.prototype.slice.call(arguments, 1)

  return function() {
    // 如果 this 不是全局对象也不是 undefined，说明是被 new 调用或显式绑定
    // 保持普通调用的绑定效果
    const thisArg = (this !== globalThis && this !== undefined)
      ? this
      : obj

    return fn.apply(thisArg, params.concat(Array.prototype.slice.call(arguments)))
  }
}

// 测试
function foo() {
  console.log(this.name)
}

const obj = { name: 'obj' }
const softBar = foo.softBind(obj)

softBar()                // “obj” - 软绑定生效
softBar.call(globalThis)  // “obj” - 仍然绑定到 obj，不会变成 globalThis
new softBar()             // {} - new 调用返回新对象
```

**为什么需要软绑定？**

当库函数内部使用了 `bind` 绑定 `this`，但用户可能用 `new` 调用——软绑定可以让库函数在两种场景下都工作正常。

---

### 6 种 this 丢失场景及解决方案

#### 场景1：方法赋值给变量

```js
const obj = {
  name: 'John',
  foo() { console.log(this.name) }
}

const bar = obj.foo
bar() // undefined 或报错（默认绑定）
```

**解决**：
```js
// 方案1：箭头函数包装
const bar = () => obj.foo()

// 方案2：bind
const bar = obj.foo.bind(obj)

// 方案3：使用 Proxy（高级）
const bar = new Proxy(obj.foo, {
  apply(target, thisArg, args) {
    return target.apply(obj, args)
  }
})
```

#### 场景2：作为回调传递

```js
const obj = {
  name: 'John',
  foo() { console.log(this.name) }
}

setTimeout(obj.foo, 100) // undefined
```

**解决**：
```js
// 方案1：箭头函数包装（推荐）
setTimeout(() => obj.foo(), 100)

// 方案2：bind
setTimeout(obj.foo.bind(obj), 100)

// 方案3：使用 thisArg 参数（部分数组方法支持）
;[1, 2, 3].forEach(obj.foo, obj)
```

#### 场景3：构造函数中的异步回调

```js
class User {
  constructor(name) {
    this.name = name
    setTimeout(function() {
      console.log(this.name) // undefined
    }, 100)
  }
}
```

**解决**：
```js
// 方案1：箭头函数
setTimeout(() => {
  console.log(this.name)
}, 100)

// 方案2：bind
setTimeout(function() {
  console.log(this.name)
}.bind(this), 100)
```

#### 场景4：DOM 事件处理

```js
const obj = {
  name: 'John',
  init() {
    document.getElementById('btn').addEventListener('click', function() {
      console.log(this.name) // undefined - 事件处理函数中 this 指向 DOM 元素
    })
  }
}
```

**解决**：
```js
// 方案1：箭头函数
addEventListener('click', () => {
  console.log(this.name)
})

// 方案2：bind
addEventListener('click', function() {
  console.log(this.name)
}.bind(this))
```

#### 场景5：类数组借用方法

```js
const arrayLike = { 0: 'a', 1: 'b', length: 2 }

// 这里 this 会指向 window
const result = Array.prototype.slice.call(arrayLike)
```

**解决**：
```js
// 直接 .call() 绑定
const result = Array.prototype.slice.call(arrayLike)

// 或者使用 .bind()
const slice = Array.prototype.slice.bind(arrayLike)
```

#### 场景6：Promise 回调中的 this

```js
class Service {
  constructor() {
    this.name = 'Service'
  }

  fetchData() {
    return fetch('/api/data')
      .then(function(response) {
        console.log(this.name) // undefined - 回调函数 this 指向 globalThis
        return response.json()
      })
  }
}
```

**解决**：
```js
// 箭头函数（推荐）
.then((response) => {
  console.log(this.name) // “Service”
  return response.json()
})

// 或提前 bind
.then(function(response) {
  console.log(this.name)
  return response.json()
}.bind(this))
```

---

### 箭头函数作为对象方法的争议

箭头函数没有 `this`，所以如果作为对象方法调用，`this` 不会指向该对象。

```js
const obj = {
  name: 'John',
  // 箭头函数作为方法 - 不推荐
  foo: () => {
    console.log(this.name) // undefined - this 是定义时的外层，不是 obj
  },

  // 普通函数作为方法 - 推荐
  bar() {
    console.log(this.name) // “John” - this 指向 obj
  }
}
```

**为什么很多人误用？**

```js
// 错误示例：误以为箭头函数会正确捕获 obj
const obj = {
  name: 'obj',
  // 错误：箭头函数 this 不会指向 obj
  getName: () => this.name
}

obj.getName() // undefined
```

**何时可以用箭头函数作为方法？**

```js
// 场景：需要引用外层 this 的工厂函数
const createCounter = () => {
  let count = 0
  return {
    increment: () => ++count, // 箭头函数访问外层 count
    getCount: () => count
  }
}
```

---

### React / Vue 中的 this 处理差异

#### Vue 3（组合式 API）

Vue 3 的 `<script setup>` 中不需要担心 `this`：

```vue
<script setup>
import { ref } from 'vue'

const name = ref('Vue')

// 无需担心 this，ref 直接可用
const getName = () => console.log(name.value)
</script>
```

但 Options API 中仍需注意：

```js
export default {
  data() {
    return { name: 'Vue' }
  },
  methods: {
    // 这些方法的 this 自动绑定到组件实例
    getName() {
      console.log(this.name) // “Vue”
    },

    // 回调中使用箭头函数会丢失 this
    fetchData: () => {
      console.log(this.name) // undefined - 箭头函数 this 指向模块作用域
    }
  }
}
```

#### React

React 类组件需要手动绑定或用箭头函数：

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }

    // 必须绑定，否则 this.handleClick 是 undefined
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    // 方案1：bind 在构造函数中
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}
```

更现代的做法（Hook 组件）：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // 不需要担心 this，因为没有 this
  const handleClick = () => setCount(count + 1)

  return <button onClick={handleClick}>{count}</button>
}
```

**核心差异**：

| 维度 | Vue | React |
|------|-----|-------|
| this 绑定 | Options API 自动处理 | 需要手动 bind 或用箭头函数 |
| 组合式 API | 无 this 问题 | Hook 组件无 this |
| 箭头函数方法 | 不推荐（会丢失 Vue 实例） | 不推荐（同理） |

---

### 手写 call/apply/bind 追问

**追问1**：`call` 和 `apply` 的区别？

```js
Function.prototype.myCall = function(thisArg, ...args) {
  const fn = this
  const uniqueSymbol = Symbol('fn')

  // 将函数临时挂载到 thisArg 对象上
  thisArg[uniqueSymbol] = fn

  // 调用时 this 指向 thisArg
  const result = thisArg[uniqueSymbol](...args)

  // 清理
  delete thisArg[uniqueSymbol]

  return result
}

// apply 区别：参数用数组
Function.prototype.myApply = function(thisArg, argsArray) {
  const fn = this
  const uniqueSymbol = Symbol('fn')

  thisArg[uniqueSymbol] = fn

  const result = thisArg[uniqueSymbol](...argsArray)

  delete thisArg[uniqueSymbol]

  return result
}
```

**追问2**：`bind` 返回的新函数被 `new` 调用会怎样？

```js
function foo() {
  console.log(this.name)
}

const obj = { name: 'obj' }
const bound = foo.bind(obj)

// 普通调用：this 绑定到 obj
bound() // “obj”

// 用 new 调用：bind 绑定被忽略，this 指向新实例
new bound() // {} - 新实例没有 name 属性
```

**原因**：`new` 操作符会忽略硬绑定的 `this`，优先创建新实例。

---

## 面试回答模板

**问题**：`this` 的四种绑定方式及优先级？

**高分回答**：

> JavaScript 中 `this` 的绑定取决于调用方式，有四种规则：
>
> 1. **默认绑定**：独立调用的函数，`this` 指向全局对象（严格模式下是 `undefined`）
> 2. **隐式绑定**：作为对象方法调用，`this` 指向那个对象，但如果方法被赋值给变量会丢失
> 3. **显式绑定**：通过 `call/apply/bind` 强制指定，`bind` 返回新函数永久绑定
> 4. **new 绑定**：构造函数调用，`this` 指向新创建的实例
>
> 优先级：**new > 显式绑定 > 隐式绑定 > 默认绑定**
>
> 实际开发中，**最常见的问题是回调中的 this 丢失**。解决方案是使用箭头函数（在定义时捕获 this）或提前 `bind`。
>
> 框架中的差异：Vue 的 Options API 自动处理 this 绑定，而 React 需要手动 bind 或使用箭头函数/Hook。

---

## 相关链接

- [MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [You Don't Know JS - this](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)
- [JavaScript 软绑定 polyfill](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/this%20%26%20object%20prototypes/ch6.md)