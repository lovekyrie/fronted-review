// 从右向左组合：compose(f,g,h)(x) === f(g(h(x)))
function compose() {
  const args = arguments
  const start = args.length - 1
  return function () {
    let i = start
    let result = args[start].apply(this, arguments) // 最右侧函数先执行
    while (i--) result = args[i].call(this, result)
    return result
  }
}

export default compose
