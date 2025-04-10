//对象转字符串和数字
//1 对象转字符串 1.1 primValue=ToPrimitive(input,String) 1.2返回ToString(primValue)
//2 对象转数字 2.1 primValue=ToPrimitive(input,Number) 2.2返回ToNumber(primValue)
/* 
如果是 ToPrimitive(obj, Number)， 处理步骤如下：
如果 obj 为 基本类型， 直接返回
否则， 调用 valueOf 方法， 如果返回一个原始值， 则 JavaScript 将其返回。
否则， 调用 toString 方法， 如果返回一个原始值， 则 JavaScript 将其返回。
否则， JavaScript 抛出一个类型错误异常。

如果是 ToPrimitive(obj, String)， 处理步骤如下：
如果 obj为 基本类型， 直接返回
否则， 调用 toString 方法， 如果返回一个原始值， 则 JavaScript 将其返回。
否则， 调用 valueOf 方法， 如果返回一个原始值， 则 JavaScript 将其返回。
否则， JavaScript 抛出一个类型错误异常。 */

console.log(Number({})) //NaN
console.log(Number({
  a: 1
})) //NaN

console.log(Number([])) //0
console.log(Number([0])) //0
console.log(Number([1, 2, 3])) //NaN 先调用valueOf得到[1,2,3]再调用toString得到'1,2,3',接下来ToNumber
console.log(Number(function () {
  var a = 1;
})) //NaN
console.log(Number(/\d+/g)) //NaN
console.log(Number(new Date(2020, 0, 1))) //1577808000000
console.log(Number(new Error('a'))) //NaN