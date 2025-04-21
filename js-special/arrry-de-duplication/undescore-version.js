// 参考underscore实现
const arr = [1, 1, 'A', 'a', 2, 2]

// iteratee 英文释义：迭代 重复
function unique(array, isSorted, iteratee) {
  const res = []
  let seen = []
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i]
    const computed = iteratee ? iteratee(current) : current
    if (isSorted) {
      if (!i || seen !== current) {
        res.push(current)
      }
      seen = current
    }
    else if (iteratee) {
      if (!seen.includes(computed)) {
        seen.push(computed)
        res.push(current)
      }
    }
    else {
      if (!res.includes(current)) {
        res.push(current)
      }
    }
  }
  return res
}

console.log(
  unique(arr, false, (item) => {
    return typeof item == 'string' ? item.toLowerCase() : item
  }),
)
