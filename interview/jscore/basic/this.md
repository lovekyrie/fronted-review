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