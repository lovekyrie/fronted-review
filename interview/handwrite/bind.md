# Function.prototype.bind 原理

```javascript
// eslint-disable-next-line no-extend-native
Function.prototype.myBind = function (context, ...rest) {
  const slice = Array.prototype.slice
  const self = this
  const args = slice.apply(rest, [1])
  return function (...rest1) {
    const currentArgs = slice.apply(rest1)
    const allArgs = args.concat(currentArgs)
    return self.apply(context, allArgs)
  }
}

const User = {
  count: 1,
  getCount() {
    return this.count
  },
}

const getCount = User.getCount.myBind(User)
console.log(getCount())
```

## 每日练习参考

### Day 11：myBind

```js
Function.prototype.myBind = function (thisArg, ...preset) {
  const originFn = this
  const boundFn = function (...args) {
    // new 调用时 this 是 boundFn 的实例，忽略绑定对象
    return originFn.apply(
      this instanceof boundFn ? this : thisArg,
      [...preset, ...args]
    )
  }
  // 继承原函数原型
  if (originFn.prototype) {
    boundFn.prototype = Object.create(originFn.prototype)
  }
  return boundFn
}
```
