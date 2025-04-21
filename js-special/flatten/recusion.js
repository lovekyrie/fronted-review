// 1 递归
console.time('recusion')
const arr = [1, [2, [3, 4]]]
function flatten(array) {
  let result = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    if (Array.isArray(current)) {
      result = result.concat(flatten(current))
    }
    else {
      result.push(current)
    }
  }
  return result
}
console.log(flatten(arr))
console.timeEnd('recusion')
