//在一个排好序的数组中找到 value 对应的位置，保证插入数组后，依然保持有序的状态。
// exp:sortedIndex([10, 20, 30], 25); // 2

function sortedIndex(array, obj) {

  var low = 0,
    high = array.length
  while (low < high) {
    var mid = Math.floor((low + high) / 2)
    if (array[mid] < obj) low = mid + 1
    else high = mid
  }
  return high
}
console.log(sortedIndex([10, 20, 30, 40, 50], 35))

/* var stooges = [{name: 'stooge1', age: 10}, {name: 'stooge2', age: 30}];

var result = sortedIndex(stooges, {name: 'stooge3', age: 20}, function(stooge){
    return stooge.age
});

console.log(result) // 1 
所以我们还需要再加上一个参数 iteratee 函数对数组的每一个元素进行处理， 
一般这个时候， 还会涉及到 this 指向的问题， 所以我们再传一个 context 来让我们可以指定 this
*/

function cb(func, context) {
  if (context === void 0) return func
  return function () {
    return func.apply(context, arguments)
  }
}

function sortedIndexV2(array, obj, iteratee, context) {

  iteratee = cb(iteratee, context)

  var low = 0,
    high = array.length
  while (low < high) {
    var mid = Math.floor((low + high) / 2)
    if (iteratee(array[mid]) < iteratee(obj)) low = mid + 1
    else high = mid
  }
  return high
}
var stooges = [{
  name: 'stooge1',
  age: 10
}, {
  name: 'stooge2',
  age: 30
}];

var result = sortedIndexV2(stooges, {
  name: 'stooge3',
  age: 20
}, function (stooge) {
  return stooge.age
});

console.log(result)

module.exports = sortedIndexV2