// 循环方式实现数组filter
function selfFilter(fn, context) {
  const arr = Array.prototype.slice.call(this)
  const filterArr = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const cur = arr[i]
    if (!arr.hasOwnProperty(i))
      continue
    fn.call(context, cur, i, arr) && filterArr.push(cur)
  }
  return filterArr
}

Array.prototype.selfFilter = selfFilter
console.log([1, 2, 3, 4, 5].selfFilter(item => item > 3))
