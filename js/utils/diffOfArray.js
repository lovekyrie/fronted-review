// loadsh 也有这个函数Array.difference
function array_diff(a, b) {
  return a.filter(item => !b.includes(item))
}

console.log(array_diff([1, 2, 3], [1, 2]))
