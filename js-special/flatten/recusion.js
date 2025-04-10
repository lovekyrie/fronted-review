//1 递归
console.time("recusion");
var arr = [1, [2, [3, 4]]];
function flatten(array) {
  var result = [];
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];
    if (Array.isArray(current)) {
      result = result.concat(flatten(current));
    } else {
      result.push(current);
    }
  }
  return result;
}
console.log(flatten(arr));
console.timeEnd("recusion");
