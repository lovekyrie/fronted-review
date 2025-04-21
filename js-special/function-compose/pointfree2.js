// 需求：输入 'kevin daisy kelly'，返回 'K.D.K'

const curry = require('../curry/v2')
const compose = require('./underscore-mock')

function head(str) {
  return str.slice(0, 1)
}
function toUpperCase(str) {
  return str.toUpperCase()
}
// 非 pointfree，因为提到了数据：name
var initials = function (name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('.')
}

// ponitfree, 先定义基本运算
const split = curry((sperator, str) => {
  return str.split(sperator)
})
const join = curry((sperator, arr) => {
  return arr.join(sperator)
})
const map = curry((fn, arr) => {
  return arr.map(fn)
})
var initials = compose(join(' '), map(compose(toUpperCase, head)), split(' '))
console.log(initials('kevin diasy kelly'))
// 从这个例子我们可以看出利用curry跟compose 非常有利于实现pointfree
