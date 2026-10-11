# How Function.prototype.call works

```javascript
// Handwritten call
// eslint-disable-next-line no-extend-native
Function.prototype.selfCall = function (context, ...arg) {
  const func = this
  context = context || window || globalThis
  if (typeof func !== 'function')
    throw new TypeError('this is not a function')
  const caller = Symbol('caller') // avoid name clashes
  context[caller] = func
  const res = context[caller](...arg)
  delete context[caller]
  return res
}
// The idea: run the function as a property of the given context.
// Symbol is used so the temporary key cannot collide with existing properties.

const User = {
  count: 1,
  getCount() {
    return this.count
  },
}

console.log(User.getCount.selfCall(User))
```

## Daily practice reference

### Day 11: 4-question step comparison

| Question | Core steps | Key edge cases |
|------|----------|----------|
| `call` | Attach the function to the target object and invoke it | If `thisArg == null`, use `globalThis`; use `Symbol` to avoid property collisions |
| `bind` | Return a new function with preset arguments | When called with `new`, ignore the bound object (`this instanceof` check) |
| `new` | Create object → wire prototype → run constructor → return | If the constructor returns an object, use that return value; otherwise use the new instance |
| `instanceof` | Walk `__proto__` looking for `prototype` | Stop at `null`; primitives return `false` immediately |

### Day 11: Handwrite answer order

```text
1. Explain the idea first (one sentence for the core principle)
2. Write the code (explain each step as you write)
3. Cover edge cases (null handling, Symbol to avoid collisions, new compatibility, etc.)
```

### Day 11: myCall

```js
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}
```

## Day 7 practice code

```js
// Question 1: handwritten call
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}

// Question 2: handwritten debounce
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```
