function debounceImmediate(fn, wait, immediate) {
  let timeoutId, context, args

  const later = immediate => setTimeout(() => {
    if (!immediate) {
      fn.apply(context, args)
      timeoutId = context = args = null
    }
  }, wait)

  return function (...args1) {
    if (!timeoutId) {
      timeoutId = later(true)
      if (immediate) {
        fn.apply(this, args1)
      }

      context = this
      args = args1
    }
    else {
      clearTimeout(timeoutId)
      timeoutId = later(false)
    }
  }
}
