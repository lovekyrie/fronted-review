//Es6 展开运算符
console.time("es6");
var arr = [1, [2, [3, 4]]];
// console.log([].concat(...arr)); //[1,2,[3,4]]

function flatten(arr) {
  // 循环两次，因为arr展开一次就拆一层
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

console.log(flatten(arr));
console.timeEnd("es6");
