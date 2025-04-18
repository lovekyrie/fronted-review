//mdn例子
// 标准的闭包函数
function A() {
  var i = 0;
  return function b() {
    return ++i;
  };
}

var v = A();
console.log(v());
console.log(v());

// 箭头函数的闭包
var Add = (i = 0) => {
  return () => ++i;
};
var v = Add();
console.log(v());
console.log(v());
// 因为只有一个返回 return 和 return后面的()也可以省略
var Add =
  (i = 1) =>
  () =>
    ++i;
