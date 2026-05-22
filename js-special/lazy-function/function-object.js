// 缓存挂在函数对象上，仍每次进入函数体判断
function foo() {
  if (foo.t)
    return foo.t
  foo.t = new Date()
  return foo.t
}
// 依然没解决第一个问题
