function _flatten(arr) {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? _flatten(cur) : cur)
  }, [])
}
