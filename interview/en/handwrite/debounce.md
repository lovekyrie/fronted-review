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

## Daily practice reference

### Day 12: Debounce vs throttle

| Dimension | Debounce | Throttle |
|------|----------------|-----------------|
| Meaning | Wait a bit, only run the last call | Run at a fixed frequency |
| Typical use | Search-box input, window resize end | Scroll events, drag |
| Timing | Runs after triggering stops for `delay` | Runs at least once every `delay` |
| leading | Fire immediately on the first call | Fire immediately on the first call |
| trailing | Fire the last call after the delay | Fire the last call after the delay |

### Day 12: debounce (with leading / trailing / cancel)

```js
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null
  let isInvoked = false  // whether leading has already fired

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
