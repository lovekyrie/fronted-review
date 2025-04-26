// 给定字符串 str，检查其是否包含 连续3个数字，请使用正则表达式实现。
// 1、如果包含，返回最先出现的 3 个数字的字符串
// 2、如果不包含，返回 false
function captureThreeNumbers(str) {
  const result = /(\d{3})/.exec(str)
  return result ? result[0] : false
}

console.log(captureThreeNumbers('abc123'))
console.log(captureThreeNumbers('abc1234'))
console.log(captureThreeNumbers('abc12345'))
console.log(captureThreeNumbers('abc123456'))
