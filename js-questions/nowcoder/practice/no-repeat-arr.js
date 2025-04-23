function _getUniqueNums(start, end, n) {
  // 补全代码
  const arr = []
  while (arr.length < n) {
    // Math.random() => [0, 1)
    const random = Math.floor(Math.random() * (end - start + 1)) + start
    if (!arr.includes(random)) {
      arr.push(random)
    }
  }
  return arr
}

console.log(_getUniqueNums(2, 10, 5))
