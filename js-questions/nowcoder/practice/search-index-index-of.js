// 统计字符串中目标字符串出现的次数
function _searchStrIndexOf(str, target) {
  // 补全代码
  let count = 0
  while (str.includes(target)) {
    count++
    str = str.slice(str.indexOf(target) + 1)
  }
  return count
}

// 实现2
function _searchStrIndexOf2(str, target) {
  return str.split(target).length - 1
}

// 实现3
function _searchStrIndexOf3(str, target) {
  return str.match(new RegExp(target, 'g')).length
}

console.log(_searchStrIndexOf('hello world', 'o'))
console.log(_searchStrIndexOf2('hello world', 'o'))
console.log(_searchStrIndexOf3('hello world', 'o'))
