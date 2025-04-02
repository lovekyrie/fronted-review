function debounce(fn, wait) {
  let time, context
  return function (...args) {
    if (time) {
      clearTimeout(time)
    }

    time = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
