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
