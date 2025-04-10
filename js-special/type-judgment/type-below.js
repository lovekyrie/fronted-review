//jquery方法实现
const type = require("./type-upon");

function isWindow(obj) {
  return obj != null && obj.window === obj;
}

/* 返回true需满足3个条件
  1. 是数组
  2. length为0
  3. length>0 并且属性为number，并且obj[length-1]存在 */
function isArrayLike(obj) {
  //obj必须有length属性
  var length = !!obj && "length" in obj && obj.length;
  var typeRes = type(obj); //type就是判断类型的方法

  //排除掉函数跟window
  if (typeRes === "function" || isWindow(obj)) {
    return false;
  }

  return (
    typeRes === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
}

console.log(isArrayLike([1, 2, 3]));

module.exports = isArrayLike