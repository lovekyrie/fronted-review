/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
function map(arr, fn) {
  return arr.reduce((acc, next, idx) => {
    acc.push(fn(next, idx))
    return acc
  }, [])
}

const arr = [1, 2, 3]
function fn(n) {
  return n + 1
}

map(arr, fn)
