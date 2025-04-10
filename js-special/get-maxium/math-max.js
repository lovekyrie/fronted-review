var arr = [6, 4, 1, 8, 2, 11, 23];

var result = arr[0];
for (var i = 1, len = arr.length; i < len; i++) {
  result = Math.max(result, arr[i]);
}
console.log(result);
