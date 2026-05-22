// 闭包版惰性：避免污染全局，但每次调用仍要 if (t)
const foo = (function () {
  let t
  return function () {
    if (t)
      return t
    t = new Date()
    return t
  }
})()
// 不过还是没有解决普通方便的 每次调用函数需要判断的问题
