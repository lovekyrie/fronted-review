# 函数节流 (Throttle)

```javascript
// 函数节流
function throttle(func, time = 100, options = {
  leading: true,
  trailing: false,
  context: null,
}) {
  let timer
  let previous = new Date(0).getTime()
  const _throttle = function (...args) {
    const now = +new Date()
    if (!options.leading) {
      // 第一次非立即执行
      if (timer)
        return
      timer = setTimeout(() => {
        func.apply(options.context, args)
        timer = null
      }, time)
    }
    else if (now - previous > time) {
      // 第一次立即执行，因为previous为0，任何时间都会大于time
      func.apply(options.context, args)
      previous = now
    }
    else if (options.trailing) {
      // 最后执行一次
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(options.context, arg)
      }, time)
    }
  }

  _throttle.cancel = function () {
    previous = new Date(0).getTime()
    clearTimeout(timer)
    timer = null
  }

  return _throttle
}
```

## 每日练习参考

### Day 12：throttle（时间戳法）

```js
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
```
