// 浅合并：后续 source 覆盖 target 同名属性
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
