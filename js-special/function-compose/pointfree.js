const compose = require('./underscore-mock')
// 要求输入：'kevin',返回'HELLO,KEVIN'
// 非pointfree方式，因为直接使用了name
var greet = function (name) {
  return (`hello ${name}`).toLowerCase()
}

// ponitfree
// 先定义基本运算，这些可以封装起来复用
function toUpperCase(x) {
  return x.toUpperCase()
}
function hello(x) {
  return `HELLO, ${x}`
}
var greet = compose(hello, toUpperCase)
greet('kevin')
