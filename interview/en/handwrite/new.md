# How the new operator works

```javascript
// Handwritten new
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

## Daily practice reference

### Day 11: myNew

```js
function myNew(Ctor, ...args) {
  // 1. Create a new object whose prototype is Ctor.prototype
  const obj = Object.create(Ctor.prototype)
  // 2. Run the constructor with this bound
  const result = Ctor.apply(obj, args)
  // 3. If the constructor returns an object, use that value; otherwise use the new instance
  return result !== null && typeof result === 'object' ? result : obj
}
```
