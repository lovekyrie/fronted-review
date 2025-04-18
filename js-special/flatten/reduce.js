//利用reduce，会返回上一步执行结果
console.time("reduce");
var arr = [1, [2, [3, 4]]];
function flatten(array) {
  return array.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
console.log(flatten(arr));
console.timeEnd("reduce");
