# Function throttle

```javascript
// Throttle
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
      // Do not run immediately on the first call
      if (timer)
        return
      timer = setTimeout(() => {
        func.apply(options.context, args)
        timer = null
      }, time)
    }
    else if (now - previous > time) {
      // Run immediately on the first call: previous is 0, so any now is greater than time
      func.apply(options.context, args)
      previous = now
    }
    else if (options.trailing) {
      // Run once more at the end of the window
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
