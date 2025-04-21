// 利用reduce实现filter
function selfFilter2(fn, context) {
  const arr = Array.prototype.slice.call(this)
  return arr.reduce((pre, cur, index) => {
    return fn.call(context, cur, index, arr) ? [...pre, cur] : [...pre]
  }, [])
}

Array.prototype.selfFilter2 = selfFilter2
console.log([1, 2, 3, 4, 5].selfFilter2(item => item < 3))
