// 一元操作符+ 类型转换 当+操作符作为一元运算符的时候，查看ES5规范1.4.6，会调用ToNumber处理该值
console.log(+[]) // 0
console.log(+['1']) // 1
console.log(+['1', '2', '3']) // NaN
console.log(+{}) // NaN
