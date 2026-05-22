const arr = [6, 4, 1, 8, 2, 11, 23]

// apply 把数组展开成参数列表，等价于 Math.max(...arr)
console.log(Math.max.apply(null, arr))
