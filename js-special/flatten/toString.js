// 仅适用于全数字：toString 去括号再 split（有精度/类型风险）
console.time('toString')
const arr = [1, [2, [3, 4]]]
function flatten(array) {
  return array
    .toString()
    .split(',')
    .map((item) => {
      return +item
    })
}
console.log(flatten(arr))
console.timeEnd('toString')
