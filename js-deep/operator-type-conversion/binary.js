/* 二元操作符

到底当执行 + 运算的时候，会执行怎样的步骤呢？让我们根据规范11.6.1 来捋一捋：
当计算 value1 + value2时：
lprim = ToPrimitive(value1)
rprim = ToPrimitive(value2)

如果 lprim 是字符串或者 rprim 是字符串，那么返回 ToString(lprim) 和 ToString(rprim)的拼接结果
返回 ToNumber(lprim) 和 ToNumber(rprim)的运算结果 */
// 1.Null与数字
console.log(null + 1); //1

// 2. 数组与数组
console.log([] + []);
/* 依然按照规范：

  lprim = ToPrimitive([])，[] 是数组， 相当于ToPrimitive([], Number)， 
  先调用valueOf方法， 返回对象本身， 因为不是原始值， 调用toString方法， 返回空字符串 ""
  rprim类似。
  lprim和rprim都是字符串， 执行拼接操作 

*/

// 3.数组与对象 两者结果一致
console.log([] + {});
console.log({} + []);

/* 按照规范：

  lprim = ToPrimitive([])， lprim = ""
  rprim = ToPrimitive({})， 相当于调用 ToPrimitive({}, Number)， 
  先调用 valueOf 方法， 返回对象本身， 因为不是原始值， 调用 toString 方法， 返回 "[object Object]"
  lprim 和 rprim 都是字符串， 执行拼接操作 

  值得注意的是如果直接在浏览器输入[]+{} 和{}+[]结果不一致，如果输入的是({}+[])则一致
  原因分析：其实，在不加括号的时候，{} 被当成了一个独立的空代码块，所以 {} + [] 变成了 +[]，结果就变成了 0
*/
console.log(1 + true); //2
console.log({} + {}); //"[object Object][objet Object]"
console.log(new Date(2017, 04, 21) + 1); //"Sun May 21 2017 00:00:00 GMT+0800 (CST)1"
