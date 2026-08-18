# Promise in Depth

## 1. Core Concepts

Promise is a solution for asynchronous programming that is more reasonable and more powerful than traditional solutions—callback functions and events. It was first proposed and implemented by the community. ES6 wrote it into the language standard, unified the API, and provided a native `Promise` object.

### Three States
A Promise object represents an asynchronous operation and has three states:
- **Pending**: the initial state, neither success nor failure.
- **Fulfilled**: the operation completed successfully.
- **Rejected**: the operation failed.

**Characteristics**:
1. The object's state is not affected by the outside world.
2. Once the state changes, it never changes again, and you can get that result at any time. There are only two possible transitions: `Pending -> Fulfilled` or `Pending -> Rejected`.

## 2. Basic Usage

```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* asynchronous operation succeeded */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

## 3. Static Methods

*   **Promise.all(iterable)**: succeeds only when every Promise succeeds, and returns an array of results; fails immediately if any one fails.
*   **Promise.race(iterable)**: race mechanism. Whichever Promise changes state first, the result follows (whether success or failure).
*   **Promise.allSettled(iterable)**: added in ES2020. Waits until every Promise finishes (success or failure), and returns an array of result objects.
*   **Promise.resolve(value)**: returns a Promise resolved with the given value.
*   **Promise.reject(reason)**: returns a Promise rejected with the given reason.

## 4. Common Interview Question: Hand-write a Simplified Promise

In interviews you usually do not need a full Promise/A+ implementation, but you do need the core logic (state management and callback storage).

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

        if (this.state === 'fulfilled') {
            onFulfilled(this.value);
        }
        
        if (this.state === 'rejected') {
            onRejected(this.reason);
        }

        if (this.state === 'pending') {
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
}
```

## 5. Exam Point: Value Penetration

```javascript
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```
**Output**: `1`
**Explanation**: `.then` or `.catch` expects a function. If you pass a non-function, value penetration occurs.

## 6. Common API Details (Frequently Followed Up)

### 6.1 Relationship among then / catch / finally

- `catch(fn)` is essentially `then(undefined, fn)`.
- `finally(fn)` does not receive the previous result. It is only for "cleanup" (for example, closing a loading indicator).
- `finally` passes the previous result through, unless it throws or returns a rejected Promise.

```js
Promise.resolve('ok')
  .finally(() => {
    console.log('cleanup');
  })
  .then((res) => console.log(res)); // 'ok'
```

### 6.2 The Promise executor runs synchronously

```js
console.log('A');
new Promise((resolve) => {
  console.log('B'); // runs synchronously
  resolve();
}).then(() => console.log('C'));
console.log('D');
// Output: A B D C
```

## 7. Common Interview Traps

### 7.1 Cases where errors are not caught by catch

An error thrown inside an async callback is not necessarily caught by the outer Promise's `catch`. You need to wrap the async work in a Promise.

### 7.2 Forgetting return in a Promise chain

```js
Promise.resolve(1)
  .then((n) => {
    Promise.resolve(n + 1); // forgot return
  })
  .then((n) => console.log(n)); // undefined
```

## 8. How to Answer "Hand-write a Promise" More Solidly

Interviews do not always require a full A+ implementation, but you should at least explain:

1. State machine (`pending` may transition only once).
2. Callback queues (handle `then` registered before an async resolve).
3. `then` returns a new Promise (to support chaining).
4. Error penetration and exception handling (wrap execution in `try/catch`).
