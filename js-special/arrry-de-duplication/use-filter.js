// Es5 提供了filter方法，可以用来简化外层循环
// 使用indexOf
const arr = [1, 2, 1, 1, '1']
function unique(array) {
  const res = array.filter((item, index, array) => {
    return array.indexOf(item) === index
  })

  return res
}

console.time('filter')
console.log(unique(arr))
console.timeEnd('filter')

// 排序去重
function unique1(array) {
  const res = array
    .concat()
    .sort()
    .filter((item, index, array) => {
      return !index || item !== array[index - 1]
    })
  return res
}
console.time('sort')
console.log(unique1(arr))
console.timeEnd('sort')
