// 如果第二个参数 bUnicode255For1 === true，则所有字符长度为 1
// 否则如果字符 Unicode 编码 > 255 则长度为 2
function strLength(s, bUnicode255For1) {
  if (!bUnicode255For1) {
    let count = 0
    for (let i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 255) {
        count += 2
      }
      else {
        count += 1
      }
    }
    return count
  }
  return s.length
}

console.log(strLength('hello world 楚雨荨', true)) // 15
console.log(strLength('hello world 楚雨荨', false)) // 18
