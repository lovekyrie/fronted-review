// call 是否绑定this的区别
function each(obj, callback) {
  var i = 0
  var length = obj.length
  for (i; i < length; i++) {
    callback(i, obj[i])
  }
}

function eachWithCall(obj, callback) {
  var i = 0;
  var length = obj.length

  for (i; i < length; i++) {
    callback.call(obj[i], i, obj[i])
  }
}
var arr = Array.from({
  length: 10000
}, (v, i) => i)

console.time('each')
var i = 0;
each(arr, function (index, item) {
  i += item
})
console.timeEnd('each')
console.time('eachWithCall')
var j = 0;
eachWithCall(arr, function (index, item) {
  j += item
})
console.timeEnd('eachWithCall')
/* each 函数和 eachWithCall 函数唯一的区别就是 eachWithCall 调用了 call， 
从结果我们可以推测出， call 会导致性能损失， 但也正是 call 的存在， 我们才能将 this 指向循环中当前的元素 */