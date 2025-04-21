// 双重循环 兼容性好
console.time('timer')
const array = [1, 1, '1', '1']

function unique(arr) {
  const res = []
  for (let i = 0, len = arr.length; i < len; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      // 当循环到存在过的数据时，直接跳出内存循环
      if (arr[i] === res[j]) {
        break
      }
    }
    // 如果arr[i]是唯一的，那么执行完循环，j等于resLen
    if (j === resLen) {
      res.push(arr[i])
    }
  }

  return res
}

console.log(unique(array))
console.timeEnd('timer')
