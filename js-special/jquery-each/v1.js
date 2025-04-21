// 第一版
const isArrayLike = require('../type-judgment/type-below')

function each(obj, callback) {
  let length; let i = 0
  if (isArrayLike(obj)) {
    length = obj.length
    for (; i < length; i++) {
      // 中止循环
      if (callback(i, obj[i]) === false) {
        break
      }
    }
  }
  else {
    for (i in obj) {
      // 中止循环
      if (callback(i, obj[i]) === false) {
        break
      }
    }
  }

  return obj
}
