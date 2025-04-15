// 排序方式
/**
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 */
function sortBy(arr, fn) {
  arr.sort((a, b) => {
    return fn(a) - fn(b)
  })
}
