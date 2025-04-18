// 参考underscore实现
var arr = [1, 1, "A", "a", 2, 2];

//iteratee 英文释义：迭代 重复
function unique(array, isSorted, iteratee) {
  var res = [],
    seen = [];
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];
    var computed = iteratee ? iteratee(current) : current;
    if (isSorted) {
      if (!i || seen !== current) {
        res.push(current);
      }
      seen = current;
    } else if (iteratee) {
      if (seen.indexOf(computed) === -1) {
        seen.push(computed);
        res.push(current);
      }
    } else {
      if (res.indexOf(current) === -1) {
        res.push(current);
      }
    }
  }
  return res;
}

console.log(
  unique(arr, false, function (item) {
    return typeof item == "string" ? item.toLowerCase() : item;
  })
);
