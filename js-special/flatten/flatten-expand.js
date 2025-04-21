// underscore函数的扩展实现
const flatten = require('./underscore-mock')
// 1. _.flatten
_.flatten = function (array, shallow) {
  return flatten(array, shallow, false)
}
// 在正常的扁平中，我们并不需要去掉非数组元素

// 2._.union 该函数传入多个数组，然后返回传入数组的并集，并且过滤掉非数组元素

/* _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2, 3, 101, 10]

_.union([1, 2, 3], [101, 2, 1, 10], 4, 5);
=> [1, 2, 3, 101, 10] */
function unique(array) {
  return Array.from(new Set(array))
}
_.union = unique(flatten(array, true, true))

// 3._.difference 效果是取出来自 array 数组，并且不存在于多个 other 数组的元素,同过滤非数组元素

/* _.difference([1, 2, 3, 4, 5], [5, 2, 10], [4], 3);
=> [1, 3] */
function difference(array, ...rest) {
  rest = flatten(rest, true, true)
  return array.filter((item) => {
    return !rest.includes(item)
  })
}
