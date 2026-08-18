# Generators

## 1. Basics

A Generator is an ES6 async-programming primitive. Calling a Generator function returns an Iterator. So a Generator is both a state machine and an iterator factory.

### Syntax
1. A `*` between `function` and the name.
2. `yield` expressions inside the body mark internal states.

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
// Calling it does not run the body; it returns a pointer to the internal state
console.log(hw.next()); // { value: 'hello', done: false }
console.log(hw.next()); // { value: 'world', done: false }
console.log(hw.next()); // { value: 'ending', done: true }
console.log(hw.next()); // { value: undefined, done: true }
```

## 2. Core API: next()

`next(arg)` treats `arg` as the **return value of the previous `yield`**. That lets the outside world inject values at each pause and change the function’s path.

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next(12) // Object{value:8, done:false} 
// yield (x + 1) becomes 12, so y = 2 * 12 = 24. yield(y/3) => yield(8)
a.next(13) // Object{value:42, done:true}
// yield (y / 3) becomes 13, so z = 13. return 5 + 24 + 13 = 42
```

## 3. Coroutines

Generators are ES6’s coroutine.
- **Coroutine**: lighter than a thread. A normal function runs to the end; a coroutine can pause (`yield`), yield control, then resume (`next`) when ready.
- **Why it matters**: non-blocking control flow on single-threaded JS.

## 4. Use cases

### Control flow
Avoid callback hell. Today we mostly use async/await; Generator is the idea underneath.

### Iterator protocol
You can quickly put an Iterator on any object with a Generator.

### Redux-Saga
The React middleware Redux-Saga uses Generators for side effects (e.g. async requests).
