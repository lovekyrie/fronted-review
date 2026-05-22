// reduce + 递归：prev 累加，子数组继续 flatten
console.time('reduce')
const arr = [1, [2, [3, 4]]]
function flatten(array) {
  return array.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flatten(next) : next)
  }, [])
}
console.log(flatten(arr))
console.timeEnd('reduce')
