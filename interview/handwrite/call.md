# Function.prototype.call 原理

```javascript
// 手写实现call
// eslint-disable-next-line no-extend-native
Function.prototype.selfCall = function (context, ...arg) {
  const func = this
  context = context || window || globalThis
  if (typeof func !== 'function')
    throw new TypeError('this is not a function')
  const caller = Symbol('caller') // 防止重名
  context[caller] = func
  const res = context[caller](...arg)
  delete context[caller]
  return res
}
// 原理就是将函数作为传入的上下文参数（context）的属性执行，这里为了防止属性冲突使用了 ES6 的 Symbol 类型

const User = {
  count: 1,
  getCount() {
    return this.count
  },
}

console.log(User.getCount.selfCall(User))
```
