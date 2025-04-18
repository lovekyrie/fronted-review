// 函数声明跟函数表达式重名,结果类似于函数声明跟变量声明重名的情况
function a() {
  console.log(1);
}
console.log("first a:" + a);
var a = function () {
  console.log(1);
};
console.log("second a:" + a);
