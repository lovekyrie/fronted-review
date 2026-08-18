---
title: this Binding and How It Works
description: The four this-binding rules in JavaScript, common loss cases, how softBind works, and how frameworks handle this
---

### How `this` is resolved
In JavaScript, `this` is a special keyword. Its value depends on how the function is called.

#### Default binding
In non-strict mode, when a function is called standalone (`fun()`), `this` defaults to the global object.

```js
function foo() {
  console.log(this);
}

foo(); // window/global
```

In strict mode (`'use strict'`), `this` is bound to `undefined`, which avoids accidentally mutating globals.
```js
'use strict';
function foo() {
  console.log(this);
}

foo(); // undefined
```

#### Implicit binding
When a function is called as a method of an object, `this` is implicitly bound to that object.
**Note**: implicit binding is easy to “lose”. If the method is assigned to a variable or passed as a callback, it falls back to default binding (global or `undefined`).

```js
const obj = {
  name: 'John',
  foo() {
    console.log(this.name);
  }
};

obj.foo(); // 'John'
```

**Note**: assigning the function to a variable loses the `this` binding.

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

#### Explicit binding
With `call`, `apply`, or `bind`, you can force `this` when the function runs. That is explicit binding.
- **call/apply**: invoke immediately. The only difference is how arguments are passed (argument list vs array).
- **bind**: returns a new wrapper that permanently locks `this`, to be called later.

1. **The `call` method**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
foo.call(obj); // 'John'
```

2. **The `apply` method**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
foo.apply(obj); // 'John'
```

3. **The `bind` method**

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'John' };
const bar = foo.bind(obj);
bar(); // 'John'
```

#### `new` binding
When a constructor is called with `new`, these steps happen:
1. Create a brand-new object.
2. Link it via `[[Prototype]]`.
3. Bind the call’s `this` to that new object.
4. If the function does not return another object, return the new object automatically.

```js
function Person(name) {
  this.name = name;
}

const person = new Person('John');
console.log(person.name); // 'John'
```

#### Arrow functions
Arrow functions do not bind their own `this`. They “capture” `this` from the enclosing lexical scope at definition time.
**Traits**: arrow-function `this` cannot be changed with `call`/`apply`/`bind`. They work well as callbacks (timers, event listeners).

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

### Common interview questions
1. **`this` resolution**
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

2. **`this` in arrow functions**
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

3. **`this` in constructors**
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

### Best practices
1. **Prefer arrow functions**: in callbacks (timers, array methods, Promise), prefer arrows so they capture the outer `this`. Avoid the outdated `self = this` pattern.
2. **Explicit binding as a fallback**: if the context is unclear, `bind` `this` explicitly.
3. **Binding class methods**: in React class components or plain ES6 classes, if a method will be passed as a callback, `bind` it in the constructor or define it as an arrow-function property.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  // Wrong: regular function
  fetchUserData() {
    fetch('/api/user')
      .then(function(response) {
        // this is window or undefined
        console.log(this.name); // throws: Cannot read property 'name' of undefined
      });
  }
}
```

```js
class User {
  constructor(name) {
    this.name = name;
  }

  // Correct: arrow function
  fetchUserData() {
    fetch('/api/user')
      .then((response) => {
        // arrow keeps this as the User instance
        console.log(this.name); // logs the user name
      });
  }

  // Another example: event handling
  setupEventListeners() {
    document.getElementById('button')
      .addEventListener('click', () => {
        // arrow keeps this as the User instance
        this.handleClick();
      });
  }

  handleClick() {
    console.log(`Hello, ${this.name}!`);
  }
}

// Usage
const user = new User('John');
user.fetchUserData();
user.setupEventListeners();
```

### Advanced notes: binding priority and pitfalls

#### Binding priority (high-frequency interview topic)

When one call could match several rules, priority is:

1. `new` binding
2. Explicit binding (`call`/`apply`/`bind`)
3. Implicit binding (method call)
4. Default binding (standalone call)

```js
function foo() {
  console.log(this.name);
}

const obj = { name: 'obj' };
const bar = foo.bind(obj);
const baz = new bar();

console.log(baz.name); // undefined (new wins; this is the new object)
```

#### When explicit binding does not apply

- If a function returned by `bind` is called with `new`, the `this` from `bind` is ignored.
- Arrow functions cannot change `this` via `call`/`apply`/`bind`.

```js
const obj = { name: 'obj' };
const arrow = () => console.log(this?.name);
arrow.call(obj); // still the outer this from definition time, not obj
```

#### Practical tips (extra)

1. For methods passed as callbacks, fix `this` at definition time (arrow function or bind early).
2. When exposing a public API, do not rely on implicit binding; that reduces misuse by callers.
3. In interviews, walk through “rule → example → counterexample (pitfalls)” — that scores better.

---

## Deeper principles and follow-up questions

### How softBind works

The problem with `bind`: if you call the bound function with `new`, the hard-bound `this` is ignored. Soft bind is a workaround — a `new` call still returns the new object, but a normal call binds to the specified object.

```js
Function.prototype.softBind = function(obj) {
  const fn = this
  const params = Array.prototype.slice.call(arguments, 1)

  return function() {
    // this is not global/undefined: called with new or explicit binding
    // otherwise keep the soft-bound obj
    const thisArg = (this !== globalThis && this !== undefined)
      ? this
      : obj

    return fn.apply(thisArg, params.concat(Array.prototype.slice.call(arguments)))
  }
}

// Test
function foo() {
  console.log(this.name)
}

const obj = { name: 'obj' }
const softBar = foo.softBind(obj)

softBar()                // "obj" — soft bind applies
softBar.call(globalThis)  // "obj" — still bound to obj, not globalThis
new softBar()             // {} — new returns a new object
```

**Why softBind?**

When a library function uses `bind` internally, but a user may call it with `new` — soft bind lets the function work in both cases.

---

### Six this-loss cases and fixes

#### Case 1: assigning a method to a variable

```js
const obj = {
  name: 'John',
  foo() { console.log(this.name) }
}

const bar = obj.foo
bar() // undefined or throws (default binding)
```

**Fix**:
```js
// Option 1: wrap with an arrow function
const bar = () => obj.foo()

// Option 2: bind
const bar = obj.foo.bind(obj)

// Option 3: Proxy (advanced)
const bar = new Proxy(obj.foo, {
  apply(target, thisArg, args) {
    return target.apply(obj, args)
  }
})
```

#### Case 2: passing as a callback

```js
const obj = {
  name: 'John',
  foo() { console.log(this.name) }
}

setTimeout(obj.foo, 100) // undefined
```

**Fix**:
```js
// Option 1: wrap with an arrow function (preferred)
setTimeout(() => obj.foo(), 100)

// Option 2: bind
setTimeout(obj.foo.bind(obj), 100)

// Option 3: thisArg (supported by some array methods)
;[1, 2, 3].forEach(obj.foo, obj)
```

#### Case 3: async callbacks inside a constructor

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

**Fix**:
```js
// Option 1: arrow function
setTimeout(() => {
  console.log(this.name)
}, 100)

// Option 2: bind
setTimeout(function() {
  console.log(this.name)
}.bind(this), 100)
```

#### Case 4: DOM event handlers

```js
const obj = {
  name: 'John',
  init() {
    document.getElementById('btn').addEventListener('click', function() {
      console.log(this.name) // undefined — in the handler, this is the DOM element
    })
  }
}
```

**Fix**:
```js
// Option 1: arrow function
addEventListener('click', () => {
  console.log(this.name)
})

// Option 2: bind
addEventListener('click', function() {
  console.log(this.name)
}.bind(this))
```

#### Case 5: borrowing methods for array-like objects

```js
const arrayLike = { 0: 'a', 1: 'b', length: 2 }

// this is not arrayLike; arrayLike is treated as the start argument
const slice = Array.prototype.slice
const result = slice(arrayLike)
```

**Fix**:
```js
// Bind with .call()
const result = Array.prototype.slice.call(arrayLike)

// Or use .bind()
const slice = Array.prototype.slice.bind(arrayLike)
```

#### Case 6: `this` in Promise callbacks

```js
class Service {
  constructor() {
    this.name = 'Service'
  }

  fetchData() {
    return fetch('/api/data')
      .then(function(response) {
        console.log(this.name) // undefined — callback this is globalThis
        return response.json()
      })
  }
}
```

**Fix**:
```js
// Arrow function (preferred)
.then((response) => {
  console.log(this.name) // "Service"
  return response.json()
})

// Or bind ahead of time
.then(function(response) {
  console.log(this.name)
  return response.json()
}.bind(this))
```

---

### Using arrow functions as object methods

Arrow functions have no `this`, so if you call one as an object method, `this` will not be that object.

```js
const obj = {
  name: 'John',
  // Arrow function as a method — not recommended
  foo: () => {
    console.log(this.name) // undefined — this is the outer scope at definition time, not obj
  },

  // Regular function as a method — recommended
  bar() {
    console.log(this.name) // "John" — this is obj
  }
}
```

**Why do people misuse this?**

```js
// Wrong: assuming the arrow function captures obj
const obj = {
  name: 'obj',
  // Wrong: arrow-function this is not obj
  getName: () => this.name
}

obj.getName() // undefined
```

**When is an arrow method OK?**

```js
// Use case: factory that needs the outer this
const createCounter = () => {
  let count = 0
  return {
    increment: () => ++count, // arrow reads outer count
    getCount: () => count
  }
}
```

---

### How React and Vue handle `this`

#### Vue 3 (Composition API)

In Vue 3 `<script setup>` you do not need to worry about `this`:

```vue
<script setup>
import { ref } from 'vue'

const name = ref('Vue')

// No this to worry about; use the ref directly
const getName = () => console.log(name.value)
</script>
```

Options API still needs care:

```js
export default {
  data() {
    return { name: 'Vue' }
  },
  methods: {
    // these methods have this bound to the component instance
    getName() {
      console.log(this.name) // "Vue"
    },

    // Arrow function in methods loses this
    fetchData: () => {
      console.log(this.name) // undefined — arrow-function this is the module scope
    }
  }
}
```

#### React

React class components need a manual bind or an arrow function:

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }

    // Must bind, or this is lost when handleClick is passed
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    // Option 1: bind in the constructor
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}
```

The more modern approach (Hook components):

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // No this to worry about
  const handleClick = () => setCount(count + 1)

  return <button onClick={handleClick}>{count}</button>
}
```

**Core differences**:

| Aspect | Vue | React |
|------|-----|-------|
| this binding | Options API handles it automatically | Need to bind manually or use arrow functions |
| Composition API | No this issues | Hook components have no this |
| Arrow-function methods | Not recommended (loses the Vue instance) | Not recommended (same reason) |

---

### Follow-ups on handwritten call/apply/bind

**Follow-up 1**: What is the difference between `call` and `apply`?

```js
Function.prototype.myCall = function(thisArg, ...args) {
  const fn = this
  const uniqueSymbol = Symbol('fn')

  // Temporarily attach the function to thisArg
  thisArg[uniqueSymbol] = fn

  // this is thisArg when called
  const result = thisArg[uniqueSymbol](...args)

  // Clean up
  delete thisArg[uniqueSymbol]

  return result
}

// apply difference: args as an array
Function.prototype.myApply = function(thisArg, argsArray) {
  const fn = this
  const uniqueSymbol = Symbol('fn')

  thisArg[uniqueSymbol] = fn

  const result = thisArg[uniqueSymbol](...argsArray)

  delete thisArg[uniqueSymbol]

  return result
}
```

**Follow-up 2**: What happens if the function returned by `bind` is called with `new`?

```js
function foo() {
  console.log(this.name)
}

const obj = { name: 'obj' }
const bound = foo.bind(obj)

// Normal call: this is bound to obj
bound() // "obj"

// Called with new: bind is ignored, this is the new instance
new bound() // {} — the new instance has no name
```

**Why**: the `new` operator ignores hard-bound `this` and prefers creating a new instance.

---

## Interview answer template

**Question**: What are the four `this`-binding rules, and what is their priority?

**High-scoring answer**:

> In JavaScript, `this` depends on how the function is called. There are four rules:
>
> 1. **Default binding**: a standalone call; `this` is the global object (`undefined` in strict mode)
> 2. **Implicit binding**: called as an object method; `this` is that object, but assigning the method to a variable loses it
> 3. **Explicit binding**: force `this` with `call`/`apply`/`bind`; `bind` returns a new permanently bound function
> 4. **`new` binding**: constructor call; `this` is the newly created instance
>
> Priority: **new > explicit > implicit > default**
>
> In real code, **the most common issue is losing `this` in callbacks**. Fix it with an arrow function (capture `this` at definition time) or bind early.
>
> Framework difference: Vue Options API binds `this` for you; React needs a manual bind, an arrow function, or Hooks.

---

## Related links

- [MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [You Don't Know JS - this](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)
- [JavaScript softBind polyfill](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/this%20%26%20object%20prototypes/ch6.md)
