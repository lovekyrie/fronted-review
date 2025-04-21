// 用indexOf简化 双重循环的内层循环
console.time('timer')
const array = [1, 1, '-1', '-1']

function unique(arr) {
  const res = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const current = arr[i]
    if (!res.includes(current)) {
      res.push(current)
    }
  }
  return res
}

console.log(unique(array))
console.timeEnd('timer')

// demo 1
const arr = [1, 2, Number.NaN]
arr.indexOf(Number.NaN) // -1
// indexOf底层还是使用===进行判断，NaN===NaN,所以使用indexOf查找不到NaN
