// === 认为 +0 与 -0 相等，用 1/x 区分符号
function equal(a, b) {
  if (a === b)
    return a !== 0 || 1 / a === 1 / b
  return false
}

console.log(equal(0, 0))
console.log(equal(0, -0))
