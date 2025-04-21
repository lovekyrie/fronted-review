// 支持多个函数
function compose() {
  const args = arguments
  const start = args.length - 1
  return function () {
    let i = start
    let result = args[start].apply(this, arguments)
    while (i--) result = args[i].call(this, result)
    return result
  }
}

module.exports = compose
