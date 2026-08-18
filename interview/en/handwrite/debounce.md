# Function debounce

```javascript
// Debounce
function debounce(func, time = 100, options = {
  leading: true,
  context: null,
}) {
  let timer
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    // Fire immediately on the first call when leading is true
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

/* `leading` means "run once as soon as we enter".
   A timer is used: if the event fires again within `time`, the previous timer is cleared
   and a new one is set, so the function does not run until the delay elapses.
   A `cancel` function is exposed via closure so callers can clear the inner timer. */
```
