---
title: Scope, Closures, and Memory Management
description: JavaScript scope chains, hoisting, how closures work, the module pattern, and memory-leak scenarios
---

### Scope
Scope is the region of source code where a variable is defined. It determines how variables are looked up — that is, what the currently executing code is allowed to access.

#### Scope types
JavaScript mainly has three kinds of scope:
1. **Global scope**: accessible anywhere in the code; its lifetime spans the whole application.
2. **Function scope**: variables defined inside a function cannot be accessed from outside.
3. **Block scope** (ES6+): a region wrapped in `{}` (such as if/for/switch). Only `let/const` follow this rule.

1. **Global Scope**

```js
// Global scope
var globalVar = 'global';
let globalLet = 'global';
const globalConst = 'global';

function globalFunc() {
  console.log(globalVar); // accessible
}
```

2. **Function Scope**

```js
function functionScope() {
  // Function scope
  var functionVar = 'function';
  let functionLet = 'function';
  const functionConst = 'function';
  
  console.log(globalVar); // can access global variables
}

// console.log(functionVar); // Error: functionVar is not defined
```

3. **Block Scope**

```js
{
  // Block scope
  let blockLet = 'block';
  const blockConst = 'block';
  var blockVar = 'block'; // var has no block scope
}

// console.log(blockLet); // Error: blockLet is not defined
console.log(blockVar); // accessible because var has no block scope
```

### Scope Chain
When looking up a variable, the JS engine follows the "nearest first" rule:
1. Look in the **current scope** first.
2. If not found, look in the **parent scope**.
3. Keep walking up until the **global scope**.
This layered chain of relationships is the **scope chain**.
**Key point**: the scope chain is determined when the function is **defined** (lexical scope), not when it is called.

#### How the scope chain is created
(This part involves the execution context; in practice you only need to remember the lexical-scope rule.)

```js
var globalVar = 'global';

function outer() {
  var outerVar = 'outer';
  
  function inner() {
    var innerVar = 'inner';
    console.log(innerVar); // inner
    console.log(outerVar); // outer (walked up to outer)
    console.log(globalVar); // global (walked up to global)
  }
  
  inner();
}

outer();
```

### Hoisting
Before running the code, the JS engine **precompiles** it and moves variable and function declarations to the top of the scope.

#### Hoisting of `var`
`var` declarations are hoisted, but **initialization is not**. Accessing the variable before assignment yields `undefined`.

```js
console.log(hoistedVar); // undefined
var hoistedVar = 'hoisted';

// equivalent to
// var hoistedVar;
// console.log(hoistedVar);
// hoistedVar = 'hoisted';
```

#### Hoisting of `let` and `const`
`let/const` are also hoisted, but they sit in the **Temporal Dead Zone (TDZ)**. Accessing them before the declaration runs **throws**.

```js
// console.log(hoistedLet); // Error: Cannot access 'hoistedLet' before initialization
let hoistedLet = 'hoisted';

// let and const have a Temporal Dead Zone (TDZ)
```

### Closure
**Definition**: a function bundled together with a reference to its surrounding state (the lexical environment) — or, a function enclosed by those references — is a closure.
**Plain-language view**: an inner function references variables from an outer function, so those outer variables cannot be released (even after the outer function has finished).

#### Basic use of closures

```js
function createCounter() {
  let count = 0; // This variable is referenced by the object below, so it will not be GC'd
  
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

#### Closure use cases
1. **Data privacy (simulating private properties)**
   Hide variables with a closure and only expose an API.

```js
function createPerson(name) {
  let _name = name; // private variable
  
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

2. **Function factory / Currying**
   Produce a function that already carries specific arguments.

```js
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2); // remembers x = 2
console.log(multiplyByTwo(3)); // 6
```

### Common interview questions
1. **Hoisting and the Temporal Dead Zone (TDZ)**
   - `var` is hoisted and initialized to `undefined`.
   - `let/const` are hoisted but enter the TDZ; accessing them throws.

```js
console.log(a); // undefined
var a = 1;

// console.log(b); // Error: Cannot access 'b' before initialization
let b = 2;
```

2. **Variables in closures (the classic loop trap)**
   - **Problem**: `var` is function-scoped. When the loop ends, `i` is `5`, and every timer callback references that same `i`.
   - **Fixes**:
     1. Use `let` (block scope; each iteration gets a new `i`).
     2. Use an IIFE (immediately invoked function expression) to capture the current `i` in a closure.

```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // prints 5 five times
  }, 0);
}

// Solution 1: use let
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // prints 0,1,2,3,4
  }, 0);
}

// Solution 2: use a closure (IIFE)
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // prints 0,1,2,3,4
    }, 0);
  })(i);
}
```

3. **Scope-chain lookup**
   - The inner function `inner` defines its own `a`, so it prints `3`.
   - If you comment out `var a = 3` inside `inner`, it prints `outer`'s `2`.
   - The "nearest first" rule always applies.

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

### Best practices
1. **Default to `const`**: use `const` unless the variable needs to be reassigned.
2. **Use `let` when mutation is needed**: loop counters or state variables use `let`.
3. **Do not use `var`**: avoid bugs from hoisting and global pollution.
4. **Watch for closure memory leaks**: if a closure holds a large DOM node or object, set it to `null` or remove the listener when you no longer need it.
5. **Use IIFEs thoughtfully**: even though ES Modules are widespread, an IIFE is still a useful way to isolate scope in older environments or special cases.

---

## High-frequency follow-ups and deeper principles

### Module Pattern and data privacy

The module pattern uses closures for data privacy. It is a classic JavaScript design pattern.

#### Basic module pattern

```js
const Counter = (function() {
  // private state
  let count = 0

  // private method
  function validate(value) {
    return typeof value === 'number' && value > 0
  }

  // public interface
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
Counter.count       // undefined - private variable cannot be accessed directly
```

#### Revealing Module Pattern

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

  // reveal the public interface
  return {
    increment: _increment,
    decrement: _decrement,
    getCount: _getCount
  }
})()
```

#### Module Pattern vs ES6 modules

| Dimension | Module Pattern | ES6 modules |
|------|----------|----------|
| Syntax | Function closures | import/export |
| Static analysis | No | Yes (tree-shaking) |
| Runtime | Each call creates a new instance | Singleton |
| State | Multiple instances possible | Global singleton |
| Best for | Complex state, factory functions | Standard modular code |

---

### Closures and GC: memory-leak scenarios

#### Why can closures cause memory leaks?

Normally, after a function finishes, variables in its scope are collected by the GC. If a closure is formed, variables in the outer function's scope are still referenced by the inner function, so **the GC cannot collect them**.

#### Memory-leak scenario 1: circular references

```js
function createLeak() {
  const largeData = new Array(100000)

  // largeData is no longer used elsewhere, but the closure still references it
  const leak = function() {
    return largeData
  }

  // as long as leak exists, largeData cannot be GC'd
  return leak
}

const fn = createLeak()
// even if fn is no longer needed, largeData still occupies memory
fn = null // must set to null manually to release
```

#### Memory-leak scenario 2: DOM event listeners

```js
class Listener {
  constructor() {
    this.element = document.getElementById('btn')
    this.data = new Array(100000)

    // the closure references this.data
    this.element.addEventListener('click', () => {
      console.log(this.data) // the closure keeps data alive
    })
  }

  // Wrong: no cleanup
  destroy() {
    // only removes the listener, but does not drop the reference to this.data
    this.element.removeEventListener('click', this.handler)
  }
}
```

**Correct approach**:

```js
class Listener {
  constructor() {
    this.element = document.getElementById('btn')
    this.data = new Array(100000)

    // keep a reference so it can be removed
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

#### Memory-leak scenario 3: setTimeout + closures

```js
function process() {
  const largeData = new Array(100000)

  // if this timer is never cleared, largeData can never be released
  setTimeout(function() {
    console.log(largeData) // the closure keeps data alive
  }, 60000) // runs only after 1 minute

  // if you need to clear it immediately
  const timeoutId = setTimeout(...)
  clearTimeout(timeoutId)
}
```

---

### Deeper TDZ follow-up: hoisting priority of `var` vs `function`

#### Hoisting rules

```js
// actual execution order
console.log(foo) // function foo() { return 2 }
console.log(bar) // undefined

var foo = 1
function bar() { return 2 }
```

**The actual structure after hoisting**:

```js
// 1. Function declarations are hoisted (fully)
function bar() { return 2 }

// 2. var declarations are hoisted (initialization is not)
var foo

// 3. Execution phase
console.log(foo) // undefined - foo is declared but not assigned
console.log(bar) // function - bar is already a complete function

foo = 1
```

#### Function declarations override `var` declarations

```js
var foo = 1

function foo() { return 2 }

// Result: foo is function 2 (function declarations override var)
console.log(typeof foo) // "function"
console.log(foo()) // 2
```

#### Behavior of conditional function declarations

```js
// older browsers may behave incorrectly
if (true) {
  function test() { return 1 }
} else {
  function test() { return 2 }
}

// behavior differs across browsers:
// Chrome: test = 2 (the last defined function wins)
// Firefox: test = 1 (the function in else is not hoisted)
```

---

### Variable scope in try-catch

Variables in try-catch are block-scoped:

```js
try {
  JSON.parse('{ invalid json }')
} catch (e) {
  // e is only valid inside the catch block
  console.log(e) // SyntaxError: Unexpected token
}

// e does not exist here
console.log(e) // ReferenceError: e is not defined
```

#### Performance considerations for try-catch

V8 does optimize try-catch, but watch out for:

```js
// Wrong: returning from inside try-catch can prevent V8 optimization
function badExample() {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

// Correct: extract to an outer function
function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

// V8 can optimize parseJSON
function process() {
  return parseJSON(data)
}
```

---

## Interview answer template

**Question**: How do closures work, and where are they used?

**High-scoring answer**:

> A closure is a function together with its lexical environment. When an inner function references variables from an outer function, those variables are not garbage-collected even after the outer function has finished.
>
> **Common use cases**:
> 1. **Data privacy**: the module pattern exposes only the necessary API
> 2. **Function factory**: currying produces functions with specific arguments
> 3. **Callbacks**: keep a reference to the surrounding context
>
> **Risk**: closures can leak memory because referenced variables cannot be GC'd. Common cases are DOM event listeners, timers, or large objects captured in loops. The fix is to set them to `null` or remove the listeners.
>
> **Follow-up**: how do `var` and `let` differ in loops?
> - `var` is function-scoped; the loop variable is shared
> - `let` is block-scoped; each iteration gets a new variable
> - That is why `setTimeout` inside a loop should use `let` or an IIFE

---

## Related links

- [MDN Closures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [MDN Scope](https://developer.mozilla.org/zh-CN/docs/Glossary/Scope)
- [V8 closure optimization](https://v8.dev/blog/closures)
- [Module Pattern in depth](https://addyosmani.com/resources/essentialjsdesignpatterns/ detail/#modulepatternjavascript
