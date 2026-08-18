# Closure

## 1. Core Concepts

### Definition
A **closure** is a **function** that has access to variables in another function's scope.
In JavaScript, a closure is created whenever a function is created.

Simply put: **closure = function + external variables accessible inside the function**.

### Why Closures Exist
JavaScript uses **lexical scoping**. A function's scope is determined when the function is defined.
When an inner function is returned and executed outside the scope where it was defined, it still holds a reference to that defining scope. That reference is the closure.

## 2. Forms of Closures

1.  **Function as a return value**:
    ```javascript
    function createCounter() {
        let count = 0;
        return function() {
            return ++count;
        };
    }
    const counter = createCounter();
    console.log(counter()); // 1
    console.log(counter()); // 2
    ```

2.  **Function passed as an argument**:
    ```javascript
    function print(fn) {
        const a = 200;
        fn();
    }
    const a = 100;
    function fn() {
        console.log(a);
    }
    print(fn); // prints 100, not 200
    ```
  > `fn` is defined in the global scope, so when it accesses `a`, it looks in the scope where it was defined—the global `const a = 100`.
Although `fn()` is called inside `print`, and `print` also has `const a = 200`, that `a = 200` belongs only to `print`'s local scope. `fn` was not defined inside `print`, so it does not pick up `print`'s `a`.
Remember this:
Scope is determined by where a function is defined, not where it is called.
So the output is 100, not 200.

## 3. Use Cases

### 3.1 Simulating Private Variables (Module Pattern)
JavaScript had no native private properties (before ES2019). Closures are often used to encapsulate private variables and prevent external pollution.

```javascript
const User = (function() {
    let _password = '123'; // private variable

    class User {
        constructor(username) {
            this.username = username;
        }
        login(pwd) {
            return pwd === _password;
        }
    }
    return User;
})();

let u = new User('admin');
console.log(u.username); // 'admin'
console.log(u._password); // undefined
```

### 3.2 Currying
Convert a multi-argument function into a form that takes one argument at a time.

```javascript
function add(a) {
    return function(b) {
        return a + b;
    }
}
const add5 = add(5);
console.log(add5(10)); // 15
```

### 3.3 Debounce and Throttle
Debounce and throttle are the most classic uses of closures in frontend performance optimization.

```javascript
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}
```

### 3.4 once: Run Only Once

Use a closure to keep `fn`. After the first call, set `fn` to `null`; later calls go through `replacer`.

```javascript
function once(fn, replacer = null) {
    return function (...args) {
        if (fn) {
            const ret = fn.apply(this, args);
            fn = null;
            return ret;
        }
        if (replacer) {
            return replacer.apply(this, args);
        }
    };
}

const obj = {
    init: once(
        () => {
            console.log('Initializer has been called.');
        },
        () => {
            throw new Error('This method should be called only once.');
        }
    ),
};

obj.init(); // runs normally
obj.init(); // throws Error: This method should be called only once.
```

**Why does the second call throw?**

It is easy to assume that each `obj.init()` passes the arrow function into `once` again. In fact:

1. `once(originalFn, replacer)` **runs only once when `init` is defined**, and what it returns is the wrapper function.
2. `fn` in the closure is a **mutable reference**. After the first call, `fn = null`.
3. The second `obj.init()` calls the wrapper. `fn` is already `null`, so it takes the `replacer` branch and throws.

| Call | `fn` in the closure | Behavior |
|------|---------------------|----------|
| 1st | original function | Run the original function, then `fn = null` |
| 2nd | `null` | Run `replacer` (throws here) |

Equivalent mental model:

```javascript
// Roughly equivalent to the inside of once
let fn = /* the original function that was passed in */;
let replacer = /* the replacer that was passed in */;

obj.init = function (...args) {
    if (fn) { /* after use, fn = null */ }
    else if (replacer) { /* second call goes here */ }
};
```

> If you omit `replacer`, the second call silently returns `undefined` and does not throw.

## 4. Classic Interview Question: Loops and Closures

**Question**: What is the output?
```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```
**Result**: five `5`s.
**Reason**: `i` declared with `var` has function scope (here, global). After the loop, `i` is `5`. `setTimeout` runs asynchronously; by the time it runs, the loop has already finished, and every callback reads the same global `i`.

**Solutions**:
1.  **Use an IIFE (immediately invoked function expression) to create a closure**:
    ```javascript
    for (var i = 0; i < 5; i++) {
        (function(j) {
            setTimeout(function() {
                console.log(j);
            }, 1000);
        })(i);
    }
    ```
2.  **Use `let` (ES6)**:
    ```javascript
    for (let i = 0; i < 5; i++) { // let creates a block scope
        setTimeout(function() {
            console.log(i);
        }, 1000);
    }
    ```

## 5. Memory Leaks

**Misconception**: Do closures always cause memory leaks?
**Truth**: Closures keep variables in memory. That is a feature of closures. It is only a memory leak when those variables are no longer needed, but cannot be garbage-collected (GC) because a closure still references them.

**IE bug**:
In old IE (before IE9), if a DOM object is kept on a closure's scope chain, that DOM object cannot be destroyed.
```javascript
function assignHandler() {
    var element = document.getElementById("someElement");
    element.onclick = function() {
        alert(element.id); // The closure references element, and element references the function — a circular reference
    };
}
```
**Fix**: manually drop the reference with `element = null;`.
