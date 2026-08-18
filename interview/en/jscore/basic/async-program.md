### Promise and Asynchronous Programming
Asynchronous programming in JavaScript is mainly implemented with Promise, async/await, and similar APIs.

#### Promise Basics
**Promise** is a solution for asynchronous programming that is more reasonable and more powerful than traditional solutions—callback functions and events.
It is a container that holds the result of an event that will finish in the future (usually an asynchronous operation).

1. **Creating a Promise**
```js
const promise = new Promise((resolve, reject) => {
  // Asynchronous operation
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('success'); // State becomes fulfilled
    } else {
      reject('error');    // State becomes rejected
    }
  }, 1000);
});
```

2. **Promise states**
   - **pending**: in progress.
   - **fulfilled**: succeeded (resolve was called).
   - **rejected**: failed (reject was called).
   *Once the state changes, it never changes again.*

3. **Promise methods**
   - **then**: callback when the state becomes fulfilled.
   - **catch**: callback when the state becomes rejected or an error occurs.
   - **finally**: runs regardless of the state (often used to close a loading indicator).

```js
promise
  .then(result => {
    console.log(result); // 'success'
  })
  .catch(error => {
    console.error(error); // 'error'
  })
  .finally(() => {
    console.log('finally'); // Runs whether it succeeds or fails
  });
```

#### Promise Chaining
The key to solving callback hell. The `then` method returns a new Promise, so you can chain asynchronous operations.
- **Return value**: if you return a value in `then`, it becomes the argument of the next `then`; if you return a Promise, the next `then` waits for that Promise to settle.

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return fetch('https://api.example.com/other-data');
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Promise Static Methods
1. **Promise.all**
   - **Concurrent execution**: wraps multiple Promise instances into a new Promise.
   - **Success**: succeeds only when every Promise in the array succeeds (returns an array).
   - **Failure**: fails immediately as soon as one fails (returns that failure reason).

```js
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    console.error(error);
  });
```

2. **Promise.race**
   - **Race**: whichever Promise in the array changes state first (success or failure), the new Promise follows.
   - **Use case**: request timeout control (one request, one timer; the faster one wins).

```js
const promises = [
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  new Promise(resolve => setTimeout(() => resolve(2), 500))
];

Promise.race(promises)
  .then(result => {
    console.log(result); // 2
  });
```

3. **Promise.allSettled** (ES2020)
   - **Wait for all**: wait until every Promise finishes, regardless of success or failure.
   - **Return value**: an array of objects, each containing a Promise's status and result.

```js
const promises = [
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
];

Promise.allSettled(promises)
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 3 }
    // ]
  });
```

#### async/await
Syntactic sugar built on Generator and Promise, so asynchronous code can be written like synchronous code.
- **async**: declares an async function, which automatically returns a Promise.
- **await**: pauses execution, waits for the Promise to settle, and returns the resolved value.

1. **Basic usage**
```js
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

2. **Parallel requests**
   - **Note**: do not `await` inside a loop (that is serial). Create an array of Promises first, then use `Promise.all`.

```js
async function fetchMultipleData() {
  try {
    // More efficient: fire in parallel
    const [data1, data2] = await Promise.all([
      fetch('https://api.example.com/data1').then(r => r.json()),
      fetch('https://api.example.com/data2').then(r => r.json())
    ]);
    console.log(data1, data2);
  } catch (error) {
    console.error(error);
  }
}
```

#### Common Interview Questions
1. **Promise implementation (simplified)**
   - Core: maintain state, value, and callback arrays.
   - `then`: run the callback based on the current state, or push it into the callback array.

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback(value));
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    } else if (this.state === 'rejected') {
      onRejected(this.reason);
    } else {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
    return this;
  }
}
```

2. **How async/await works**
   - It is syntactic sugar over Generator, with a built-in executor.
   - It automatically calls `generator.next()`. If the yielded value is a Promise, it waits for that Promise to resolve before calling `next` again.

#### Best Practices
1. **Unify catch**: add a `catch` at the end of a Promise chain, or wrap `async/await` in `try/catch`, to prevent `unhandledrejection`.
2. **Avoid serial await**: for independent requests, prefer concurrent `Promise.all`.
3. **Promise.resolve/reject**: quickly create Promises for tests or to normalize return values.
4. **Clean up side effects**: use `finally` to close a loading state or release resources.
