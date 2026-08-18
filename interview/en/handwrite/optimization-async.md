# Cleaner async / await error handling

```javascript
// A tidy way to handle async/await
async function errorCaptured(asyncFunc) {
  try {
    const res = await asyncFunc()
    return [null, res]
  }
  catch (e) {
    return [e, null]
  }
}

const [err, res] = await errorCaptured(asyncFunc)
/* Avoid wrapping every async/await in try/catch.
   Another idea: if you use webpack, write a loader that walks the AST
   and injects try/catch around each await, so even this helper is unnecessary. */
```
