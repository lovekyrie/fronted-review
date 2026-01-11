# new 操作符原理

```javascript
// 手写new
function isComplexDataType(obj) {
  return (typeof obj === 'function' || typeof obj === 'object') && obj !== null
}

function selfNew(fn, ...rest) {
  const instance = Object.create(fn.prototype)
  const res = fn.apply(instance, rest)
  return isComplexDataType(res) ? res : instance
}

function Person(name, age) {
  this.name = name
  this.age = age
}

const person1 = new Person('kevin', 24)
const person2 = selfNew(Person, 'lilly', 28)
console.log(person1)
console.log(person2)
```
