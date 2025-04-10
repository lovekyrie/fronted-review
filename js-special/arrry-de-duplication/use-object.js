// 利用object.hasOwnProperty 赋值语句的返回值为=右边的值 详细原因参考：https://es5.github.io/#x11.13.1
var arr = [1, 2, 1, 1, "-1"];
function unique(array) {
  var obj = {};
  return array.filter((item, index, array) => {
    return obj.hasOwnProperty(typeof item + item)
      ? false
      : (obj[typeof item + item] = true); //(obj[typeof item + item] = true) 该表达式为true
  });
}

console.log(unique(arr));
