// 使用reduce实现flat扁平化 depth表示降纬深度
function selfFlat(depth = 1) {
  const arr = Array.prototype.slice.call(this)
  if (depth === 0)
    return arr
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...selfFlat.call(cur, depth - 1)]
    }
    else {
      return [...pre, cur]
    }
  }, [])
}

Array.prototype.selfFlat = selfFlat
console.log([1, 2, [3, 4], [5, [6, 7]]].selfFlat(2))
