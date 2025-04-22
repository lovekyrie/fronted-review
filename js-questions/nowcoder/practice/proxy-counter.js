let count = 0
function _proxy(object) {
  // 补全代码
  return new Proxy(object, {
    get(target, prop) {
      if (prop in object) {
        count++
      }
      else {
        count--
      }
      return target[prop]
    },
    set(target, prop, value) {
      target[prop] = value
    },
  })
}
