/* eslint-disable prefer-template */
console.log(1 + '2' + '3')
console.log(1 + +'2' + '3') // 字符串前面有+/-会被转换成数字
console.log(1 + -'1' + '2')

console.log(+'1' + 1 + '2')
// 对运算结果不能转换成数字的话则为NaN
console.log('A' - 'B' + '2')
console.log('A' - 'B' + 2) // NaN + 2还是NaN
