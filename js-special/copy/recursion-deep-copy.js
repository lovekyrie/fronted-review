// 利用递归实现深拷贝 使用递归性能受限，因为会一直叠加栈
function deepCopy(obj) {
  if (typeof obj !== 'object') {
    return false
  }

  const newObj = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key]
        = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }

  return newObj
}

const arr = [{ a: 1 }, ['a']]
const newArr = deepCopy(arr)
newArr[0].a = 2
newArr[1][0] = 'b'
console.log(arr)
console.log(newArr)
