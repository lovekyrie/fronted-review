const arr = [1, [2, 3], 4, [6, 8]]

const flatArr = Array.prototype.concat.apply([], arr)

console.log([].concat(1, [2, 3]))
console.log(flatArr)
