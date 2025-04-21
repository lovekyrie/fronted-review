const arr = [6, 4, 1, 8, 2, 11, 23]

function max(prev, next) {
  return Math.max(prev, next)
}

console.log(arr.reduce(max))
