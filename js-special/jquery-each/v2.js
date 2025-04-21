const isArrayLike = require('../type-judgment/type-below')
// 第二版 增加this指向
function each(obj, callback) {
  let length; let i = 0
  if (isArrayLike(obj)) {
    // 数组
    length = obj.length
    for (; i < length; i++) {
      if (callback(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }
  else {
    // 对象
    for (i in obj) {
      if (callback(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }

  return obj
}
