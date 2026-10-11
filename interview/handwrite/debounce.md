# 函数防抖 (Debounce)

```javascript
// 函数防抖
function debounce(func, time = 100, options = {
  leading: true,
  context: null,
}) {
  let timer
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    // 默认触发第一次情况
    if (options.leading && !timer) {
      timer = setTimeout(null, time)
      func.apply(options.context, args)
    }
    else {
      timer = setTimeout(() => {
        func.apply(options.context, args)
        timer = null
      }, time)
    }
  }

  _debounce.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return _debounce
}

/* leading 为是否在进入时立即执行一次，原理是利用定时器，
如果在规定时间内再次触发事件会将上次的定时器清除，即不会执行函数并重新设置一个新的定时器，
直到超过规定时间自动触发定时器中的函数
同时通过闭包向外暴露了一个 cancel 函数，使得外部能直接清除内部的计数器
 */
```

## 每日练习参考

### Day 12：防抖 vs 节流

| 维度 | 防抖 (debounce) | 节流 (throttle) |
|------|----------------|-----------------|
| 含义 | 等一会儿，只执行最后一次 | 固定频率执行 |
| 适用场景 | 搜索框输入、窗口 resize 结束 | 滚动事件、拖拽 |
| 时序 | 停止触发后 delay 才执行 | 每 delay 时间至少执行一次 |
| leading | 第一次立即执行 | 第一次立即执行 |
| trailing | 最后一次延迟执行 | 最后一次延迟执行 |

### Day 12：debounce（含 leading / trailing / cancel）

```js
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null
  let isInvoked = false  // leading 是否已触发

  const debounced = function (...args) {
    if (timer) clearTimeout(timer)

    if (leading && !isInvoked) {
      fn.apply(this, args)
      isInvoked = true
    }

    timer = setTimeout(() => {
      if (trailing && isInvoked !== true || trailing && !leading) {
        fn.apply(this, args)
      }
      timer = null
      isInvoked = false
    }, delay)
  }

  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
    isInvoked = false
  }

  return debounced
}
```
