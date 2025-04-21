// 模拟实现第一版extend
function extend() {
  let name, copy, options
  let i = 1
  const length = arguments.length
  const target = arguments[0]
  for (; i < length; i++) {
    options = arguments[i]
    for (name in options) {
      copy = options[name]
      if (copy !== undefined) {
        target[name] = copy
      }
    }
  }
  return target
}
