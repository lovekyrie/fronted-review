function selfMap2(fn, context) {
  const arr = Array.prototype.slice.call(this)
  return arr.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, arr)]
  }, [])
  // [...[]] 表示空数组
}

Array.prototype.selfMap2 = selfMap2
console.log([1, 2, 3].selfMap2(item => item * 3))
