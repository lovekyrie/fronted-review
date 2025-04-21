function findLastIndex(array, predicate, context) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate.call(context, array[i], i, array)) {
      return i
    }
  }
  return -1
}
console.log(findLastIndex([1, 2, 3, 4], (item, index, array) => {
  if (item === 1)
    return true
}))

module.exports = findLastIndex
