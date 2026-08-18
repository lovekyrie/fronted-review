---
title: A Deep Dive into ES6 Features
description: ES6 variable declarations, Promise static methods, what async/await really is, Iterator/Generator use cases, and ESM vs CJS differences
---

### ES6 features
ES6 (ECMAScript 2015) introduced many language features that make JavaScript more powerful and easier to use.

#### 1. Variable declarations
ES6 introduced block-scoped declarations, which fix `var` hoisting and global pollution.
- **let**: declare a mutable variable, constrained by block scope.
- **const**: declare a constant, constrained by block scope. It must be initialized, and the binding itself cannot be reassigned.
- **Note**: for a `const` object/array, inner properties can change, but you cannot reassign the whole reference.

1. **let and const**
```js
// let: mutable binding
let x = 1;
x = 2; // can reassign

// const: constant binding
const y = 1;
y = 2; // Error: Assignment to constant variable
```

2. **Block scope**
```js
{
  let x = 1;
  const y = 2;
}
console.log(x); // Error: x is not defined
```

#### 2. Arrow functions
A more concise way to define functions.
- **Trait**: they do not bind their own `this`; they inherit `this` from the outer context.
- **Limits**: cannot be used as a constructor (`new`), no `arguments` object, no `prototype`, cannot use `yield`.

1. **Basic syntax**
```js
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
```

2. **`this` binding**
```js
const obj = {
  name: 'John',
  sayHello: function() {
    setTimeout(() => {
      // this automatically points to obj
      console.log(`Hello, ${this.name}`);
    }, 100);
  }
};
```

#### 3. Destructuring
An elegant syntax for extracting values from arrays or objects.
- **Use cases**: swap variables, extract API payloads, default function parameters.
- **Note**: you can set defaults while destructuring, e.g. `const { name = 'Guest' } = {}`.

1. **Array destructuring**
```js
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
console.log(rest); // [3, 4, 5]
```

2. **Object destructuring**
```js
const { name, age, ...other } = { name: 'John', age: 30, city: 'New York' };
console.log(name); // 'John'
console.log(age); // 30
console.log(other); // { city: 'New York' }

// Rename
const { foo: f, bar: b } = { foo: 'a', bar: 'b' }
console.log(f) // 'a'
console.log(b) // 'b'

// Nested destructuring, e.g. API payload res.data.data
const {data: {data}} = res
```

#### 4. Template literals
An enhanced string syntax that supports multiline text and interpolation.
- **Syntax**: wrap with backticks `` ` ``, interpolate with `${}`.

```js
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
```

#### 5. Spread and rest
The `...` operator expands an array or object into a comma-separated sequence.
- **Spread**: merge arrays/objects, copy arrays/objects (shallow copy).
- **Rest**: collect a variable number of function arguments, replacing `arguments`.

1. **Array spread**
```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // [1, 2, 3, 4, 5]
```

2. **Object spread**
```js
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // { a: 1, b: 2, c: 3 }
```

3. **Rest parameters**
```js
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

#### 6. Class
Syntactic sugar over prototype-based inheritance, closer to traditional OOP.
- **constructor**: the constructor.
- **static**: static methods.
- **super**: call the parent class.

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // After Babel compile, sayHello is on the prototype
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

#### 7. Modules
ES6’s native module system.
- **export**: export a module interface (named export, default export).
- **import**: import interfaces from other modules.

1. **Export**
```js
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default class Calculator {}
```

2. **Import**
```js
// main.js
import Calculator, { add, subtract } from './math.js';
```

#### 8. Promise
An object for async work that solves callback hell.
- **States**: pending -> fulfilled / rejected (irreversible).
- **Chaining**: `.then()` returns a new Promise.
- **Static methods**: `Promise.all`, `Promise.race`, `Promise.allSettled`, and more.

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

#### 9. Iterators and generators
- **Iterator**: an interface that gives data structures a unified traversal mechanism (`for...of`).
- **Generator**: pause inside the function with `yield`, and return an iterator object.

1. **Iterator**
```js
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
```

2. **Generator**
```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
```

#### 10. New data structures
- **Set**: a collection of unique members (dedup).
- **Map**: a key-value collection; keys can be any type (including objects).
- **WeakMap/WeakSet**: weak-ref versions. Keys must be objects, and they do not prevent garbage collection, which helps avoid leaks.

1. **Symbol**
A unique identifier, often used as a unique object property key.
- **Note**: even with the same description, each `Symbol` is not equal.

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

#### 11. New array methods
ES6 added array methods that simplify common operations.

1. **map**
Returns a new array; each element is the callback’s return value.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

2. **filter**
Returns a new array of elements that pass the test.

```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]
```

3. **reduce**
Accumulates array elements into a single value.

```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 10
```

#### 12. New object methods

1. **Object.assign**
Merge objects (shallow copy). Later objects overwrite earlier properties with the same key.

```js
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = Object.assign({}, obj1, obj2);
console.log(obj3); // { a: 1, b: 2 }
```

2. **Object.entries**
Returns an array of the object’s own enumerable key-value pairs.

```js
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
```

3. **Object.is**
Strict equality that fixes `NaN === NaN` being false and `+0 === -0` being true.

```js
Object.is(NaN, NaN); // true
Object.is(+0, -0);   // false
```

#### Best practices
1. **Embrace const/let**: drop `var` entirely.
2. **Use destructuring well**: cleaner code, easier parameter extraction.
3. **Prefer arrow functions**: except when you need dynamic `this` (object methods, prototype methods, or event callbacks that should point at the element).
4. **Use Class**: when you need OOP, prefer Class over constructor + prototype chain.
5. **Reach for Map/Set**: frequent add/remove of key-value pairs, or dedup — often faster than Object/Array.
6. **Template literals**: first choice when concatenating strings.
7. **Modules**: stick to `import`/`export` and avoid polluting the global scope.

---

## High-frequency follow-ups and deeper principles

### Promise static methods in detail

#### Promise.all: fail the whole group if any one fails

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
        .catch(reject) // reject immediately if any promise rejects
    })
  })
}

// Test
Promise.myAll([
  Promise.resolve(1),
  new Promise(r => setTimeout(() => r(2), 100)),
  Promise.resolve(3)
]).then(console.log) // [1, 2, 3] (waits for the slowest)
```

#### Promise.allSettled: resolve only after every one settles

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

// Use case: still want successful results even if some requests fail
Promise.myAllSettled([
  fetch('/api/user'),
  fetch('/api/config') // even if this fails, user data is still usable
]).then(results => {
  const [user, config] = results
  if (user.status === 'fulfilled') {
    console.log(user.value)
  }
})
```

#### Promise.race: whichever settles first wins

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

// Use case: request timeout
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

### What async/await really is: Generator + auto-executor

#### async is syntactic sugar over Generator

```js
// async function
async function fetchData() {
  const result = await fetch('/api/data')
  return result
}

// Roughly equivalent after Babel transpile:
function fetchData() {
  return spawn(function* () {
    const result = yield fetch('/api/data')
    return result
  })
}
```

#### Implementing the auto-executor `spawn`

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

      // Recurse to keep the Promise chain
      Promise.resolve(result.value)
        .then(step)
        .catch(err => iterator.throw(err))
    }

    step()
  })
}
```

#### Common async/await pitfalls

```js
// Pitfall 1: parallel vs serial
async function loadData() {
  const a = await fetchA() // must wait for a
  const b = await fetchB() // serial; total time = a + b
}

// Correct parallel version:
async function loadData() {
  const [a, b] = await Promise.all([fetchA(), fetchB()])
}

// Pitfall 2: await in a loop
async function processItems(items) {
  const results = []
  for (const item of items) {
    results.push(await process(item)) // serial
  }
  return results
}

// Correct parallel version:
async function processItems(items) {
  return Promise.all(items.map(process))
}
```

---

### Real-world Iterator / Generator uses

#### 1. Infinite sequences

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

#### 2. Lazy evaluation

```js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

const numbers = range(1, 1000000)

// Unlike [1, 2, ..., 1000000], this does not use a huge array
// the range generator only stores current state
```

#### 3. Async iterators (for async/await)

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

// Usage
for await (const pageData of fetchPages('/api/list')) {
  console.log(pageData)
}
```

---

### ES Module vs CommonJS: runtime differences

#### Different loading order

```js
// ESM — hoisted, dependencies analyzed statically
import { a } from './module' // must be at the top of the file

// CJS — loaded at runtime
const { a } = require('./module') // can appear anywhere
```

#### Value copy vs live binding

```js
// CJS — exports a copy of the value
// counter.js
let count = 0
exports.count = count
exports.increment = () => { count++ }

// main.js
const { count, increment } = require('./counter')
console.log(count) // 0
increment()
console.log(count) // still 0!

// ESM — exports a live (read-only) binding
// counter.mjs
let count = 0
export { count }
export const increment = () => { count++ }

// main.mjs
import { count, increment } from './counter.mjs'
console.log(count) // 0
increment()
console.log(count) // 1 — count changed (live binding)
```

#### Cyclic imports

```js
// a.js
import { b } from './b.js'
export const a = 'a'
export function getA() { return a + b }

// b.js
import { a } from './a.js'
export const b = 'b'
export function getB() { return a + b }

// ESM allows cycles, but you may see uninitialized values
const bModule = require('./b.js')
const aModule = require('./a.js')
// both modules can still export
```

---

### Dynamic `import()` and code splitting

Dynamic `import()` returns a Promise and is the key to code splitting.

#### Basic usage

```js
// Static import
import { multiply } from './utils.js'

// Dynamic import
const module = await import('./utils.js')
module.multiply(2, 3)

// For code splitting
button.addEventListener('click', async () => {
  const { multiply } = await import('./utils.js')
  multiply(2, 3)
})
```

#### How Vite implements it

```js
// Vite turns dynamic import into a separate chunk
// ./utils.js is not downloaded until the button is clicked

// vite build output:
// main.js           - main bundle
// assets/utils.[hash].js  - lazy chunk
```

#### React.lazy + dynamic import

```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

// The chunk loads only when HeavyComponent is rendered
```

---

## Interview answer template

**Question**: How are async/await and Promise related?

**High-scoring answer**:

> `async`/`await` is syntactic sugar over Promise. It makes async code look synchronous.
>
> Calling an `async` function returns a Promise. `await` inside the function pauses execution until that Promise resolves, then continues.
>
> Under the hood, `async` functions compile to a Generator plus an auto-executor. Each `await` yields a Promise; the executor recursively calls `.then()` to keep the Promise chain going.
>
> **Common pitfall**: `await` in a loop becomes serial. Use `Promise.all` to run in parallel.

---

## Related links

- [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN Iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
- [ES Module specification](https://tc39.es/ecma262/#sec-modules)
