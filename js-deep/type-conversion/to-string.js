/**
 *  number: 5==>'5'
 *  Boolean,函数,Symbol: 'true'
 *  数组: [1,2]==>'1,2'
 *  对象: '[object Object]'
 */

// 原始值转字符 如果 String 函数不传参数，返回空字符串，如果有参数，调用 ToString(value)
console.log(String()) // 空字符串

console.log(String(undefined)) // undefined
console.log(String(null)) // null

console.log(String(true)) // true
console.log(String(false)) // false

console.log(String(0)) // 0
console.log(String(-0)) // 0
console.log(String(Number.NaN)) // NaN
console.log(String(Infinity)) // Infinity
console.log(String(-Infinity)) // -Infinity
console.log(String(1)) // 1
