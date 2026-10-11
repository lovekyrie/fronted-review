# How instanceof works

```javascript
/* Walk the prototype chain of `left` and compare each proto with `right.prototype`.
   Return true when a match is found; return false at the end of the chain. */
function selfInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left)
  while (true) {
    if (proto == null)
      return false
    if (proto === right.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
}
```

## Daily practice reference

### Day 11: myInstanceof

```js
function myInstanceof(obj, Ctor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') {
    return false
  }
  let proto = Object.getPrototypeOf(obj)
  while (proto !== null) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```
