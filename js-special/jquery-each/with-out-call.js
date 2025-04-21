// call 是否绑定this的区别
function each(obj, callback) {
  let i = 0
  const length = obj.length
  for (i; i < length; i++) {
    callback(i, obj[i])
  }
}

function eachWithCall(obj, callback) {
  let i = 0
  const length = obj.length

  for (i; i < length; i++) {
    callback.call(obj[i], i, obj[i])
  }
}
const arr = Array.from({
  length: 10000,
}, (v, i) => i)

console.time('each')
let i = 0
each(arr, (index, item) => {
  i += item
})
console.timeEnd('each')
console.time('eachWithCall')
let j = 0
eachWithCall(arr, (index, item) => {
  j += item
})
console.timeEnd('eachWithCall')
/* each 函数和 eachWithCall 函数唯一的区别就是 eachWithCall 调用了 call，
从结果我们可以推测出， call 会导致性能损失， 但也正是 call 的存在， 我们才能将 this 指向循环中当前的元素 */
