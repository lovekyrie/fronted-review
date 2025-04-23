### this 指向
在JavaScript中，`this`是一个特殊的关键字，它的指向取决于函数的调用方式。

#### 默认绑定
在非严格模式下，`this`指向全局对象（浏览器中是`window`，Node.js中是`global`）。
```js
function foo() {
  console.log(this);
}

foo(); // window/global
```

在严格模式下，`this`指向`undefined`。
```js
'use strict';
function foo() {
  console.log(this);
}

foo(); // undefined
```

#### 隐式绑定
当函数作为对象的方法调用时，`this`指向该对象。
```js
const obj = {
  name: 'John',
  foo() {
    console.log(this.name);
  }
};

obj.foo(); // 'John'
```

注意：当函数被赋值给变量时，会丢失`this`的指向。
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
使用`call`、`apply`或`bind`方法可以显式指定`this`的指向。

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
使用`new`关键字调用函数时，`this`指向新创建的对象。
```js
function Person(name) {
  this.name = name;
}

const person = new Person('John');
console.log(person.name); // 'John'
```

#### 箭头函数
箭头函数没有自己的`this`，它会继承外层作用域的`this`。
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
1. 使用箭头函数避免`this`指向问题
2. 使用`bind`、`call`或`apply`显式指定`this`
3. 在构造函数中使用`this`时，确保使用`new`关键字
4. 避免在回调函数中丢失`this`的指向
5. 使用`const self = this`或箭头函数保存`this`的引用
6. 在类方法中使用箭头函数定义回调
7. 使用`bind`方法创建绑定函数
8. 使用`call`或`apply`方法调用函数
9. 使用`new`关键字创建对象
10. 使用`Object.create()`创建对象 