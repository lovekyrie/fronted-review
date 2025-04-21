function findIndex(array, predicate, context) {
  for (let i = 0; i < array.length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return i
    }
  }
  return -1
}
console.log(findIndex([1, 2, 3, 4], (item, index, array) => {
  if (item === 3)
    return true
}))

module.exports = findIndex
