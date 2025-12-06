### 原型 (Prototype)
JavaScript 是基于原型的语言。每个对象拥有一个**原型对象**，对象从原型继承方法和属性。

#### 原型对象
- **`prototype`**：构造函数特有的属性，指向原型对象。
- **`__proto__`**：实例对象特有的属性（隐式原型），指向构造函数的 `prototype`。
- **关系**：`instance.__proto__ === Constructor.prototype`

```js
// 构造函数
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// 创建实例
const person = new Person('John');
person.sayHello(); // Hello, I'm John
```

#### 原型属性
推荐使用 `Object.getPrototypeOf(obj)` 获取原型，而不是非标准的 `__proto__`。

```js
// 查看原型
console.log(Person.prototype); // { sayHello: [Function] }
console.log(person.__proto__); // { sayHello: [Function] }
console.log(Object.getPrototypeOf(person)); // { sayHello: [Function] }

// 检查原型关系
console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
```

### 原型链 (Prototype Chain)
**原型链**是实现继承的核心机制。
当访问一个对象的属性时，如果对象本身没有该属性，引擎会沿着 `__proto__` 链向上查找，直到找到该属性或到达链的末端（`null`）。

![原型链示意图](prototype-chain.png)

#### 原型链的形成
通过将一个构造函数的原型设置为另一个构造函数的实例，可以建立继承关系。

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`);
};

const dog = new Dog('Buddy', 'Golden Retriever');
dog.eat(); // Buddy is eating
dog.bark(); // Buddy is barking
```

#### 原型链的查找过程
1. **自身查找**：检查对象实例本身是否有该属性。
2. **原型查找**：如果没有，通过 `__proto__` 去原型对象找。
3. **链式上溯**：如果原型对象也没有，继续通过原型的 `__proto__` 找。
4. **终点**：直到找到 `Object.prototype`，其 `__proto__` 为 `null`，查找结束。

```js
console.log(dog.name); // Buddy
console.log(dog.breed); // Golden Retriever
console.log(dog.eat); // [Function: eat]
console.log(dog.bark); // [Function: bark]
```

### 继承方式
面试中常考的几种继承方式演进。

#### 1. 原型链继承
**核心**：将子类的原型指向父类的实例。
**缺点**：
1. 引用类型的属性被所有实例共享（修改一个影响所有）。
2. 创建子类实例时无法向父类传参。

```js
function Parent() {
  this.name = 'parent';
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child() {
  this.name = 'child';
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child();
child.sayName(); // child
```

#### 2. 构造函数继承
**核心**：在子类构造函数中调用 `Parent.call(this)`。
**优点**：解决了引用属性共享和传参问题。
**缺点**：只能继承父类实例属性，**无法继承父类原型上的方法**。

```js
function Parent(name) {
  this.name = name;
}

// Parent.prototype.sayName = function() {}  // 不会被继承 

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

const child = new Child('John', 20);
console.log(child.name); // John
console.log(child.age); // 20
// console.log(child.sayName()); // 报错，无法访问
```

#### 3. 组合继承 (最常用)
**核心**：原型链继承 + 构造函数继承。
**优点**：既能传参，又能继承原型方法。
**缺点**：调用了**两次**父类构造函数（一次在设置原型时，一次在 call 时），导致子类原型上多了一份多余的父类实例属性。

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用
  this.age = age;
}

Child.prototype = new Parent(); // (注意：这里更推荐用 Object.create) 第一次调用
Child.prototype.constructor = Child;

const child = new Child('John', 20);
child.sayName(); // John
```

#### 4. 寄生组合继承 (最佳实践)
**核心**：使用 `Object.create(Parent.prototype)` 创建一个空对象作为子类原型，避免调用父类构造函数。
**优点**：最完美的 ES5 继承方案，只调用一次父类构造函数。

```js
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // 创建对象
  prototype.constructor = Child;                     // 增强对象
  Child.prototype = prototype;                       // 赋值对象
}

function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);

const child = new Child('John', 20);
child.sayName(); // John
```

### 常见面试题
1. **原型链的终点**
   - 绝大多数对象的原型链终点是 `Object.prototype`。
   - `Object.prototype.__proto__` 是 `null`。

```js
console.log(Object.prototype.__proto__); // null
```

2. **instanceof 原理**
   - 只要右边构造函数的 `prototype` 出现在左边实例的原型链上，就返回 `true`。

```js
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

console.log(myInstanceof([], Array)); // true
console.log(myInstanceof([], Object)); // true
```

3. **new 操作符的实现**
   1. 创建一个空对象，继承构造函数的原型。
   2. 执行构造函数，将 `this` 绑定到新对象。
   3. 如果构造函数返回了对象，则返回该对象；否则返回新对象。

```js
function myNew(Constructor, ...args) {
  // 1. 创建新对象，并链接原型
  const obj = Object.create(Constructor.prototype);
  // 2. 绑定 this 并执行
  const result = Constructor.apply(obj, args);
  // 3. 处理返回值
  return (result instanceof Object) ? result : obj;
}

function Person(name) {
  this.name = name;
}

const person = myNew(Person, 'John');
console.log(person.name); // John
```

### 最佳实践
1. **优先使用 class**：ES6 的 `class` 是寄生组合继承的语法糖，更清晰、更标准。
2. **避免修改 `__proto__`**：这是一个耗性能的操作，且非标准。使用 `Object.create()` 或 `Object.setPrototypeOf()`（也不推荐频繁使用）。
3. **不要扩展原生原型**：不要给 `Object.prototype` 或 `Array.prototype` 添加方法，容易造成命名冲突和覆盖。
