# Tiny CO module (auto-run generators)

```javascript
// Tiny CO module — a way to learn generator syntax
function run(generatorFunc) {
  let it = generatorFunc();
  let result = it.next();

  return new Promise((resolve, reject) => {
    const next = function (result) {
      if (result.done) {
        resolve(result.value);
      }
      result.value = Promise.resolve(result.value);
      result.value
        .then((res) => {
          let res = it.next(res);
          next(res);
        })
        .catch((err) => {
          reject(err);
        });
    };
    next(result);
  });
}

// Usage
function* func() {
  let res = yield api(data);
  console.log(res);
  let res2 = yield api(data2);
  console.log(res2);
  let res3 = yield api(data3);
  console.log(res3);
  console.log(res, res2, res3);
}

run(func);
/* `run` takes a generator. It pauses at each `yield`.
   When the promise after yield resolves, it calls `next` and moves to the next yield.
   Promises are therefore resolved one after another; when all succeed, results are printed.
   This is the idea behind async/await. */
```
