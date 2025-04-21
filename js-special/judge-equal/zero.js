// 比较正负0
function equal(a, b) {
  if (a === b)
    return a !== 0 || 1 / a === 1 / b
  return false
}

console.log(equal(0, 0))
console.log(equal(0, -0))
