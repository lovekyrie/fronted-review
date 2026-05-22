import compose from './underscore-mock.js'
// 目标：'kevin' → 'HELLO,KEVIN'

// 非 Point-Free：数据 name 贯穿业务逻辑
var greet = function (name) {
  return (`hello ${name}`).toLowerCase()
}

// Point-Free：只组合纯函数，不直接操作外部数据名
function toUpperCase(x) {
  return x.toUpperCase()
}
function hello(x) {
  return `HELLO, ${x}`
}
var greet = compose(hello, toUpperCase)
greet('kevin')
