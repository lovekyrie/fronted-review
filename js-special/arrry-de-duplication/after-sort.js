// 数组先排序后，相同的值就会被排在一起。然后我们就可以判断当前元素跟上一个元素是否相等，不相等就添加进res

console.time('timer')
var array = [1, 1, '-1', '-1']

function unique(array) {
  var res = []
  var sortedArr = array.concat().sort() //用concat()返回一个新数组
  var preVal;
  for (var i = 0, len = sortedArr.length; i < len; i++) {
    var current = sortedArr[i]
    if (!i || preVal !== current) {
      res.push(current)
    }
    preVal = current
  }

  return res
}

console.log(unique(array))
console.timeEnd('timer')