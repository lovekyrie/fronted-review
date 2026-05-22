// 模拟 $.each v1：类数组走下标，对象走 for-in
import isArrayLike from '../type-judgment/type-below.js'

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
