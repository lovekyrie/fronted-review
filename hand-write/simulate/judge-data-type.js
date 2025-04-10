//不适用判断基本数据类型，因为会进行装箱
const isType = (type) => (target) =>
  `[object ${type}]` === Object.prototype.toString.call(target);
const isArray = isType("Array"); //注意这里传的Array是字符串
console.log(isArray([]));
