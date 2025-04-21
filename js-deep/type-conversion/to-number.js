/**
 * 原始类型：
 *  string: '1'==>1,'a'==>NaN
 *  null: 0
 *  Symbol: 抛错
 * 引用类型：
 *  数组: 空数组为0，存在一个元素且为数字转数字，其他情况NaN
 *  除数组外: NaN
 */

// 原始值转数字 （根据规范，如果Number不传参数返回+0，如果有参数调用ToNumber(value)）
// Number 转换函数传入一个字符串，它会试图将其转换成一个整数或浮点数，而且会忽略所有前导的 0，如果有一个字符不是数字，结果都会返回 NaN
console.log(Number()) // +0

console.log(Number(undefined)) // NaN
console.log(Number(null)) // +0

console.log(Number(false)) // +0
console.log(Number(true)) // 1

console.log(Number('123')) // 123
console.log(Number('-123')) // -123
console.log(Number('1.2')) // 1.2
console.log(Number('000123')) // 123
console.log(Number('-000123')) // -123

console.log(Number('0x11')) // 17

console.log(Number('')) // 0
console.log(Number(' ')) // 0

console.log(Number('123 123')) // NaN
console.log(Number('foo')) // NaN
console.log(Number('100a')) // NaN
