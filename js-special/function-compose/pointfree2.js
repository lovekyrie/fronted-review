// 需求：输入 'kevin daisy kelly'，返回 'K.D.K'

const compose = require("./underscore-mock");
const curry = require("../curry/v2");
var head = function (str) {
  return str.slice(0, 1);
};
var toUpperCase = function (str) {
  return str.toUpperCase();
};
// 非 pointfree，因为提到了数据：name
var initials = function (name) {
  return name.split(" ").map(compose(toUpperCase, head)).join(".");
};

// ponitfree, 先定义基本运算
var split = curry(function (sperator, str) {
  return str.split(sperator);
});
var join = curry(function (sperator, arr) {
  return arr.join(sperator);
});
var map = curry(function (fn, arr) {
  return arr.map(fn);
});
var initials = compose(join(" "), map(compose(toUpperCase, head)), split(" "));
console.log(initials("kevin diasy kelly"));
//从这个例子我们可以看出利用curry跟compose 非常有利于实现pointfree
