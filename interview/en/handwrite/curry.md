# Function curry

```javascript
// Curry
/* Curry is a key FP technique: turn a multi-arg function into a chain of single-arg functions.
 * Another important FP helper is compose, which combines functions that each take one argument.
 * If a function needs multiple args and you still want to compose it, curry it first
 * so each step only accepts one argument (partial evaluation).
 */
function curry(fn) {
  if (fn.length <= 1)
    return fn
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args)
    }
    else {
      return (...args2) => {
        return generator(...args, ...args2)
      }
    }
  }
  return generator
}

const add = (a, b, c, d) => a + b + c + d
const curriedAdd = curry(add)
console.log(curriedAdd(5)(6)(7)(8))
```
