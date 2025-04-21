// 必报避免变量污染
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
