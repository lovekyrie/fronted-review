---
title: Prototype and Prototype Chain
description: JavaScript prototype mechanics, prototype-chain lookup, the evolution of inheritance, and how ES6 class works under the hood
---

### Prototype
JavaScript is a prototype-based language. Every object has a **prototype object**, and the object inherits methods and properties from that prototype.

#### Prototype object
- **`prototype`**: a property unique to constructor functions; it points to the prototype object.
- **`__proto__`**: a property unique to instance objects (the implicit prototype); it points to the constructor's `prototype`.
- **Relationship**: `instance.__proto__ === Constructor.prototype`

```js
// Constructor
function Person(name) {
  this.name = name;
}

// Add a method on the prototype
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// Create an instance
const person = new Person('John');
person.sayHello(); // Hello, I'm John
```

#### Prototype properties
Prefer `Object.getPrototypeOf(obj)` to get the prototype, rather than the non-standard `__proto__`.

```js
// Inspect the prototype
console.log(Person.prototype); // { sayHello: [Function] }
console.log(person.__proto__); // { sayHello: [Function] }
console.log(Object.getPrototypeOf(person)); // { sayHello: [Function] }

// Check the prototype relationship
console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
```

 > **`Person.prototype`**: every constructor written with `function` comes with a `prototype` object (you also attached properties such as `sayHello` on it).
**What `constructor` is**: on that default `prototype` object, the engine places a `constructor` property that points to the function that created this prototype object, namely `Person` itself. So the prototype object "remembers" which constructor created it.
**What the equality means**: `Person.prototype.constructor === Person` says that the `constructor` on `Person`'s prototype object still points to `Person` — the normal relationship when the prototype has not been overwritten. This pairs with a later section in this note: once you write `Dog.prototype = Object.create(Animal.prototype)`, the new object's `constructor` becomes `Animal`.

### Prototype Chain
The **prototype chain** is the core mechanism for implementing inheritance.
When you access a property on an object, if the object itself does not have that property, the engine walks up the `__proto__` chain until it finds the property or reaches the end of the chain (`null`).

![Prototype chain diagram](prototype-chain.png)

#### How the prototype chain is formed
You can set up inheritance by making one constructor's prototype an instance of another constructor.

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

// Set up the prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`);
};

const dog = new Dog('Buddy', 'Golden Retriever');
dog.eat(); // Buddy is eating
dog.bark(); // Buddy is barking
```

#### How lookup walks the prototype chain
1. **Own-property lookup**: check whether the instance itself has the property.
2. **Prototype lookup**: if not, follow `__proto__` to the prototype object.
3. **Walk up the chain**: if the prototype does not have it either, keep following the prototype's `__proto__`.
4. **End**: continue until `Object.prototype`, whose `__proto__` is `null`, and the lookup stops.

```js
console.log(dog.name); // Buddy
console.log(dog.breed); // Golden Retriever
console.log(dog.eat); // [Function: eat]
console.log(dog.bark); // [Function: bark]
```

### Inheritance patterns
Several inheritance patterns that interviews often cover, in historical order.

#### 1. Prototype-chain inheritance
**Core idea**: point the child's prototype at an instance of the parent.
**Drawbacks**:
1. Reference-type properties are shared by all instances (changing one affects all).
2. You cannot pass arguments to the parent when creating a child instance.

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

#### 2. Constructor inheritance
**Core idea**: call `Parent.call(this)` inside the child constructor.
**Pros**: solves shared reference properties and argument passing.
**Cons**: you only inherit instance properties of the parent; **you cannot inherit methods on the parent prototype**.

```js
function Parent(name) {
  this.name = name;
}

// Parent.prototype.sayName = function() {}  // will not be inherited

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

const child = new Child('John', 20);
console.log(child.name); // John
console.log(child.age); // 20
// console.log(child.sayName()); // Error: cannot access
```

#### 3. Combination inheritance (most common)
**Core idea**: prototype-chain inheritance + constructor inheritance.
**Pros**: you can pass arguments and inherit prototype methods.
**Cons**: the parent constructor is called **twice** (once when setting the prototype, once via `call`), so the child prototype ends up with a redundant copy of the parent's instance properties.

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // second call
  this.age = age;
}

Child.prototype = new Parent(); // (note: Object.create is preferred here) first call
Child.prototype.constructor = Child;

const child = new Child('John', 20);
child.sayName(); // John
```

#### 4. Parasitic combination inheritance (best practice)
**Core idea**: use `Object.create(Parent.prototype)` to create an empty object as the child prototype, avoiding a call to the parent constructor.
**Pros**: the cleanest ES5 inheritance approach; the parent constructor is called only once.

```js
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // create the object
  prototype.constructor = Child;                     // enhance the object
  Child.prototype = prototype;                       // assign the object
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

### Common interview questions
1. **The end of the prototype chain**
   - For the vast majority of objects, the chain ends at `Object.prototype`.
   - `Object.prototype.__proto__` is `null`.

```js
console.log(Object.prototype.__proto__); // null
```

2. **How `instanceof` works**
   - It returns `true` as long as the right-hand constructor's `prototype` appears on the left-hand instance's prototype chain.

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

3. **Implementing the `new` operator**
   1. Create an empty object that inherits the constructor's prototype.
   2. Run the constructor, binding `this` to the new object.
   3. If the constructor returns an object, return that object; otherwise return the new object.

```js
function myNew(Constructor, ...args) {
  // 1. Create a new object and link the prototype
  const obj = Object.create(Constructor.prototype);
  // 2. Bind this and execute
  const result = Constructor.apply(obj, args);
  // 3. Handle the return value
  return (result instanceof Object) ? result : obj;
}

function Person(name) {
  this.name = name;
}

const person = myNew(Person, 'John');
console.log(person.name); // John
```

### Best practices
1. **Prefer `class`**: ES6 `class` is syntactic sugar over parasitic combination inheritance — clearer and more standard.
2. **Avoid mutating `__proto__`**: it is expensive and non-standard. Use `Object.create()` or `Object.setPrototypeOf()` (the latter is also not recommended for frequent use).
3. **Do not extend native prototypes**: do not add methods to `Object.prototype` or `Array.prototype`; it easily causes name clashes and overrides.

---

## High-frequency follow-ups and deeper principles

### How ES6 class is implemented: syntactic sugar over parasitic combination inheritance

ES6 `class` syntax makes inheritance look more straightforward, but under the hood it is still parasitic combination inheritance.

#### From class syntax to ES5

```js
// Original class syntax
class Person {
  constructor(name) {
    this.name = name
  }

  sayHello() {
    console.log(`Hello, I'm ${this.name}`)
  }
}

class Student extends Person {
  constructor(name, grade) {
    super(name)
    this.grade = grade
  }

  study() {
    console.log(`${this.name} is studying`)
  }
}
```

 After Babel transpile, it is roughly equivalent to:

```js
// ES5 version of parasitic combination inheritance
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`)
}

function Student(name, grade) {
  Person.call(this, name)
  this.grade = grade
}

// Key: inherit via Object.create
Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student

Student.prototype.study = function() {
  console.log(`${this.name} is studying`)
}

// The extends keyword also handles static property inheritance
Student.__proto__ = Person
```

#### Special handling of the `extends` keyword

```js
class Student extends Person {
  static create(name) {
    // this in a static method points to the class itself
    return new Student(name, 'A')
  }
}

// Student.__proto__ = Person, so it is accessible
Student.create === Student.create // false, equivalent to Person.create
```

#### Restrictions on the `super` keyword

```js
class Parent {
  constructor() {
    this.name = 'parent'
  }
}

class Child extends Parent {
  constructor() {
    // Must call super before using this
    console.log(this) // ReferenceError: Must call super before using 'this'
    super()
  }
}

// Another common mistake
class Child extends Parent {
  constructor() {
    super()
    // super must be called before return
    return {} // cannot return an object literal; it would override this
  }
}
```

---

### Other uses of Object.create

#### 1. Create a prototype-less object (avoid prototype-chain lookup cost)

```js
// No prototype chain; the object has only own properties
const pureObj = Object.create(null)
pureObj.name = 'test'

// Avoid interference from default methods such as toString
// pureObj.toString // undefined, will not find Object.prototype.toString
```

#### 2. Property descriptors (the second argument)

The second argument of `Object.create` can define properties, and is more flexible than `Object.defineProperties`:

```js
const obj = Object.create(null, {
  name: {
    value: 'John',
    writable: false,      // not writable
    configurable: false,   // cannot delete or reconfigure
    enumerable: false      // not enumerable
  },
  age: {
    value: 20,
    writable: true,
    configurable: true,
    enumerable: true
  }
})

obj.name = 'Jane' // silently fails (throws in strict mode)
Object.keys(obj) // ["age"] - name is not enumerable
```

#### 3. Performance: cache function results

```js
const memoize = (fn) => {
  const cache = Object.create(null)

  return (arg) => {
    if (arg in cache) {
      return cache[arg]
    }
    return (cache[arg] = fn(arg))
  }
}

const slowFib = memoize((n) => {
  if (n <= 1) return n
  return slowFib(n - 1) + slowFib(n - 2)
})
```

#### 4. Isolate the prototype chain (a mixin variant of combination inheritance)

```js
function mixin(target, source) {
  const sourceProto = source.prototype || source
  const targetProto = target.prototype || target

  return Object.create(targetProto, Object.getOwnPropertyDescriptors(sourceProto))
}
```

---

### Prototype-chain lookup cost and optimizations

#### The cost of a very deep prototype chain

```js
function A() {}
function B() {}
function C() {}
function D() {}

B.prototype = Object.create(A.prototype)
C.prototype = Object.create(B.prototype)
D.prototype = Object.create(C.prototype)

const d = new D()

// Looking up d.name walks:
// d -> D.prototype -> C.prototype -> B.prototype -> A.prototype -> Object.prototype -> null
// 7 steps
```

#### V8 Hidden Classes optimization

V8 creates a hidden class for each object (objects with the same shape share one). Property access is O(1):

```js
const obj = { a: 1, b: 2 } // V8 creates hidden class C0

obj.c = 3 // V8 creates a new hidden class C1; properties become [a, b, c]

// Objects with the same shape share a hidden class; property offsets are fixed
const obj2 = { a: 1, b: 2 } // reuse C0
```

#### Best practice: keep the prototype chain flat

```js
// Wrong: each assignment breaks the hidden class
function Point(x, y) {
  this.x = x
  this.y = y
}

const p1 = new Point(1, 2)
const p2 = new Point(3, 4)

// Correct: define all properties at once
function Point(x, y) {
  this.x = x
  this.y = y
  this.z = 0 // declare early to keep the hidden class stable
}
```

#### Tips for faster property access

| Operation | Optimization tip |
|------|----------|
| Deep prototype chain | Cache intermediate results |
| Frequently accessed properties | Extract to local variables |
| Dynamic property assignment | Avoid adding properties dynamically in the constructor |
| for...in loops | Use Object.keys instead |

---

### Common prototype-chain follow-ups

#### Follow-up 1: Why is instanceof a poor way to detect arrays?

```js
const arr = []
arr instanceof Array // true
arr instanceof Object // true

// More reliable approaches
Array.isArray(arr) // true
Object.prototype.toString.call(arr) // "[object Array]"
```

#### Follow-up 2: Can changing the prototype chain break instanceof?

```js
function A() {}
const a = new A()

// Manually change the instance's prototype
Object.setPrototypeOf(a, Array.prototype)

a instanceof Array // true
a instanceof A // false - no longer holds!
```

#### Follow-up 3: `constructor` pointing after multi-level inheritance

```js
function A() {}
function B() {}
function C() {}

B.prototype = Object.create(A.prototype)
C.prototype = Object.create(B.prototype)

const c = new C()
c.constructor === C // false, it is actually A
c.constructor === A // true

// Must fix it manually
C.prototype.constructor = C
```

#### Follow-up 4: Why is setting `__proto__` directly discouraged?

```js
// Slow: __proto__ is a getter/setter with extra overhead
obj.__proto__ = new prototype

// Preferred: Object.create
obj = Object.create(new prototype)

// or Object.setPrototypeOf (also not recommended for frequent use)
Object.setPrototypeOf(obj, new prototype)
```

---

## Interview answer template

**Question**: How do JavaScript's prototype chain and inheritance work?

**High-scoring answer**:

> JavaScript implements inheritance through the prototype chain. Every object has a `__proto__` property pointing to its constructor's prototype object, and that prototype has its own `__proto__`, forming a lookup chain.
>
> Inheritance evolved as: prototype-chain inheritance (sharing problems) → constructor inheritance (cannot inherit the prototype) → combination inheritance (two constructor calls) → parasitic combination inheritance (the best option).
>
> ES6 `class` syntax is syntactic sugar over parasitic combination inheritance. The `extends` keyword wires up the prototype chain and static property inheritance.
>
> In real projects: avoid deep prototype chains (they hurt lookup performance), do not mutate native prototypes (they affect `instanceof`), and set prototypes with `Object.create` rather than `__proto__`.

---

## Related links

- [MDN Inheritance and the prototype chain](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN class syntax](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [V8 hidden classes blog](https://v8.dev/blog/elements-kinds)
