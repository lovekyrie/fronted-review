//用indexOf简化 双重循环的内层循环
console.time("timer");
var array = [1, 1, "-1", "-1"];

function unique(arr) {
  var res = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var current = arr[i];
    if (res.indexOf(current) === -1) {
      res.push(current);
    }
  }
  return res;
}

console.log(unique(array));
console.timeEnd("timer");

//demo 1
var arr = [1, 2, NaN];
arr.indexOf(NaN); //-1
// indexOf底层还是使用===进行判断，NaN===NaN,所以使用indexOf查找不到NaN
