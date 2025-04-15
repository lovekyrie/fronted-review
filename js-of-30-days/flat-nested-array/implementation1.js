/**
 * @param {Array} arr
 * @param {number} depth (数组第一层为0 要<n才能铺平)
 * @return {Array}
 */
function flat(arr, n) {
  const newArr = []
  const flatting = (arr, level) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const el = arr[i]
      if (Array.isArray(el) && level > 0) {
        flatting(el, level - 1)
      }
      else {
        newArr.push(el)
      }
    }
  }
  flatting(arr, n)
  return newArr
}
