// 函数对象
function foo() {
  if (foo.t)
    return foo.t
  foo.t = new Date()
  return foo.t
}
// 依然没解决第一个问题
