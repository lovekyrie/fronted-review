# Async/Await

## 1. Idea

`async/await` landed in ES2017 and is often called the “final” async syntax. It is **syntactic sugar over Generators**.

*   `async`: the function has async work and returns a Promise.
*   `await`: wait for the expression after it.

## 2. Why it beats raw Promises

1.  **Reads like sync code**: easier than a `.then().then()` chain.
2.  **Errors**: one `try...catch` covers sync and async errors. Promises need `.catch`.
3.  **Intermediate values**: in a Promise chain, later `.then` callbacks often need earlier results via outer variables or nesting. With `async/await` you just declare a variable.

## 3. How it works (interview point)

**Async/Await = Generator + an auto-runner**

A Generator only moves when you call `next()`. A function that keeps calling `next()` until `done: true` is essentially `async`.

```javascript
// Tiny auto-runner (spawn)
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      
      if(next.done) {
        return resolve(next.value);
      }
      
      // Recurse until done
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    
    step(function() { return gen.next(undefined); });
  });
}
```

## 4. Common pitfall: serial vs parallel

**Wrong (serial, slow)**:
```javascript
async function foo() {
  // getB does not start until getA finishes
  let a = await getA(); 
  let b = await getB();
}
```

**Right (parallel)**:
```javascript
async function foo() {
  // both requests start together
  let [a, b] = await Promise.all([getA(), getB()]);
}
```
or:
```javascript
async function foo() {
    let aPromise = getA();
    let bPromise = getB();
    // both requests are already in flight
    let a = await aPromise;
    let b = await bPromise;
}
```
