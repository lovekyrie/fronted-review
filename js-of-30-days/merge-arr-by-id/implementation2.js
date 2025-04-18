/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
function join(arr1, arr2) {
  const newArr = arr1.concat(arr2)
  const merged = {}
  newArr.forEach((obj) => {
    const id = obj.id
    if (!merged[id]) {
      merged[id] = { ...obj }
    }
    else {
      merged[id] = { ...merged[id], ...obj }
    }
  })

  const joinedArray = Object.values(merged)
  joinedArray.sort((a, b) => a.id - b.id)
  return joinedArray
}
