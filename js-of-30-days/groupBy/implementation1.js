/**
 * @param {Function} fn
 * @return {object}
 */
// eslint-disable-next-line no-extend-native
Array.prototype.groupBy = function (fn) {
  const merged = {}
  this.forEach((obj) => {
    const id = fn(obj)
    if (!merged[id]) {
      merged[id] = []
      merged[id].push(obj)
    }
    else {
      merged[id].push(obj)
    }
  })

  return merged
}

/**
 * [1,2,3].groupBy(String) // {"1":[1],"2":[2],"3":[3]}
 */
