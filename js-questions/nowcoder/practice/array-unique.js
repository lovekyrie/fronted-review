// 数组去重 NaN也要能去重复
function uniq(arr) {
  return [...new Set(arr)]
}

function uniq2(arr) {
  const result = []
  arr.forEach((item) => {
    if (!result.includes(item)) {
      result.push(item)
    }
  })
  return result
}

console.time('first')
console.log(uniq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, Number.NaN, Number.NaN]))
console.timeEnd('first')

console.time('second')
console.log(uniq2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, Number.NaN, Number.NaN]))
console.timeEnd('second')
