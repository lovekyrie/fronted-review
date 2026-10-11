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

## 每日练习参考

### Day 11：myNew

```js
function myNew(Ctor, ...args) {
  // 1. 创建新对象，原型指向构造函数 prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 执行构造函数，绑定 this
  const result = Ctor.apply(obj, args)
  // 3. 构造函数返回对象则用返回值，否则用新实例
  return result !== null && typeof result === 'object' ? result : obj
}
```
