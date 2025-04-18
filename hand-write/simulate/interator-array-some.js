// 利用循环实现数组的some方法
const selfSome = function (fn, context) {
  const arr = Array.prototype.slice.call(this);
  if (!arr.length) return false;
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    const res = fn.call(context, arr[i], i, arr);
    if (res) return true;
  }
  return false;
};
/* 执行 some 方法的数组如果是一个空数组，最终始终会返回 false，
而另一个数组的 every 方法中的数组如果是一个空数组，会始终返回 true */
