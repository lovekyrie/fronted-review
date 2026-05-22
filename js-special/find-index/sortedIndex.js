// 有序数组插入位置（二分），返回 high 指针
function sortedIndex(array, obj) {
  let low = 0
  let high = array.length
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (array[mid] < obj)
      low = mid + 1
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

// 绑定 iteratee 的 this
function cb(func, context) {
  if (context === void 0)
    return func
  return function () {
    return func.apply(context, arguments)
  }
}

// 支持按 iteratee 提取比较键（如对象数组的 age）
function sortedIndexV2(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context)

  let low = 0
  let high = array.length
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (iteratee(array[mid]) < iteratee(obj))
      low = mid + 1
    else high = mid
  }
  return high
}
const stooges = [{
  name: 'stooge1',
  age: 10,
}, {
  name: 'stooge2',
  age: 30,
}]

const result = sortedIndexV2(stooges, {
  name: 'stooge3',
  age: 20,
}, (stooge) => {
  return stooge.age
})

console.log(result)

export default sortedIndexV2
