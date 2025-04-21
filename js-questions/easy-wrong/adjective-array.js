// 稀疏数组
/**
 * 稀疏数组就是初始化的时候没有初始值的，比如Array(3) 结果是这样的[,,]
 * 密数组是这样的，即使数组的元素值为空，也是会赋值为undefined 如下:
 * var a = Array.apply(null, Array(3)); //[undefined,undefined,undefined]
 */
const ary = [0, 1, 2]
ary[10] = 10
ary.filter((x) => {
  return x === undefined
})
// 这里明显声明的是稀疏数组，所以结果为[]
