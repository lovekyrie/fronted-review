//underscore版本的memoize
var memoize = function (func, hasher) {
  var memoize = function (key) {
    var cache = memoize.cache
    var address = '' + (hasher ? hasher.apply(this, arguments) : key)
    if (!cache[address]) {
      cache[address] = func.apply(this, arguments)
    }
    return cache[address]
  }
  memoize.cache = {} //这个赋值的意思?还有重写memoize?
  return memoize;
}

var add = function (a, b, c) {
  return a + b + c
}

var memoizeAdd = memoize(add)
console.log(memoizeAdd(1, 2, 3)) //6
console.log(memoizeAdd(1, 2, 4)) //6 
/* 当不传入hasher的时候，只是把function的第一个参数当做key，所以对多参数不适合，
如果需要支持多参数，我们就需要传入hasher函数，自定义存储的key值，考虑使用JSON.stringify */

var memoizeAdd = memoize(add, function () {
  var args = Array.prototype.slice.call(arguments)
  return JSON.stringify(args)
})
console.log(memoizeAdd(1, 2, 3)) //6
console.log(memoizeAdd(1, 2, 4)) //6 

module.exports = memoize