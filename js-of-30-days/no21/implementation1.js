/**
 * @param {Array} arr
 * @param {number} size
 * @return {Array}
 */
function chunk(arr, size) {
  const res = []
  let index = 0
  while (index < arr.length) {
    res.push(arr.slice(index, index + size))
    index += size
  }
  return res
}
