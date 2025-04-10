//代码实现浅拷贝
var shallowCopy = function (obj) {
  //只拷贝对象
  if (typeof obj !== "object") {
    return false;
  }

  //判断需要拷贝的是数组还是对象
  var newObj = obj instanceof Array ? [] : {};

  for (var key in obj) {
    // 遍历obj，并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

var arr = [{ a: 1 }, ["a"]];
var newArr = shallowCopy(arr);
newArr[0].a = 2;
newArr[1][0] = "b";
console.log(arr);
console.log(newArr);
