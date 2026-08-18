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
