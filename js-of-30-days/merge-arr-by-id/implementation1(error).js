/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array} 执行超时，不通过
 */
function join(arr1, arr2) {
  const newArr = [...arr1, ...arr2]
  const mapKey = new Map()
  const res = newArr.reduce((acc, next) => {
    if (!mapKey.has(next.id)) {
      const lastIdx = acc.length - 1
      if (next.id > acc[lastIdx].id) {
        acc.push(next)
      }
      else {
        acc.splice(lastIdx, 0, next)
      }
      mapKey.set(next.id, next)
    }
    else {
      const obj = mapKey.get(next.id)
      const idx = acc.findIndex(k => k.id === next.id)
      acc[idx] = { ...obj, ...next }
    }
    return acc
  }, [])
}
