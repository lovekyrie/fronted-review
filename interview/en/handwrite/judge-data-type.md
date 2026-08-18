# Type checking

```javascript
// Not for primitive types: they get boxed
function isType(type) {
  return target =>
    `[object ${type}]` === Object.prototype.toString.call(target)
}
const isArray = isType('Array') // note: 'Array' is a string
console.log(isArray([]))
```
