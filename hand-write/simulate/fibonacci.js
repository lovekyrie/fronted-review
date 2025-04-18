//1. 函数记忆方式
let fibonacci = function (n) {
  if (n < 1) throw new Error("参数错误");
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const memory = function (fn) {
  const obj = {};
  return function (n) {
    if (obj[n] === void 0) obj[n] = fn(n);
    return obj[n];
  };
};

fibonacci = memory(fibonacci);
/* 利用函数记忆，将之前运算过的结果保存下来，对于频繁依赖之前结果的计算能够节省大量的时间，
例如斐波那契数列，缺点就是闭包中的 obj 对象会额外占用内存

另外使用动态规划比前者的空间复杂度更低，也是更推荐的解法 */
