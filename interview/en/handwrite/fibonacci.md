# Fibonacci (function memoization)

```javascript
// 1. Memoization
let fibonacci = function (n) {
  if (n < 1)
    throw new Error('invalid argument')
  if (n === 1 || n === 2)
    return 1
  return fibonacci(n - 1) + fibonacci(n - 2)
}

function memory(fn) {
  const obj = {}
  return function (n) {
    if (obj[n] === void 0)
      obj[n] = fn(n)
    return obj[n]
  }
}

fibonacci = memory(fibonacci)
/* Memoization stores previous results. For calculations that reuse earlier values
   (Fibonacci is the classic case) this saves a lot of time.
   The downside is the `obj` closed over in memory.

   Dynamic programming uses less extra space and is usually the better solution. */
```
