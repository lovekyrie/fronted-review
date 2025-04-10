Array.prototype.selfReduce = function (fn, initialValue) {
  const arr = Array.prototype.slice.call(this);
  let res, startIndex;
  const length = arr.length;
  if (initialValue === void 0) {
    //initialValue为undefined
    for (let i = 0; i < length; i++) {
      if (!arr.hasOwnProperty(i)) continue;
      startIndex = i;
      res = arr[i];
      break;
    }
  } else {
    //initialValue有值的情况
    res = initialValue;
  }

  for (let i = ++startIndex || 0; i < length; i++) {
    //判断稀疏数组
    if (!arr.hasOwnProperty(i)) continue;
    res = fn.call(null, res, arr[i], i, arr);
  }
  return res;
};

console.log(
  [1, 2, 3].selfReduce((prev, cur) => {
    return prev + cur;
  })
);
