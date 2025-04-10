//2. 如果数组的元素都是数字，可以考虑
console.time("toString");
var arr = [1, [2, [3, 4]]];
function flatten(array) {
  return array
    .toString()
    .split(",")
    .map(function (item) {
      return +item;
    });
}
console.log(flatten(arr));
console.timeEnd("toString");
