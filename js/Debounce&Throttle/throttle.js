function throttle(fn, wait) {
  let timeoutId = null
  return function (...args) {
    const context = this
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        fn.apply(context, args)
        timeoutId = null
      }, wait)
    }
  }
}
