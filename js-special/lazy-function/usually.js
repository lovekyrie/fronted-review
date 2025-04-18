var t;
function foo() {
  if (t) return t;
  t = new Date();
  return t;
}
// 两个问题，1.污染全局变量2.每次调用函数需要进行判断
