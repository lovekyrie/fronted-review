// ==相等操作符 1.null和undefined
console.log(undefined == null)

// (注：在类型判断系列)就是编写判断对象的类型 type 函数时，如果输入值是 undefined，就返回字符串 undefined，如果是 null，就返回字符串 null。

// 2. 字符串和数字 看规范第4、5步 存在一方为数字时，另一方转换成数字笔记 （规范在印象笔记javascript=>面试 或者在es5规范可查https://es5.github.io/#x11.9.3）
console.log('1' == 1)

// 3. 布尔值和其他类型 看规范第6、7步 当一方出现布尔值的时候，就会对这一方的值进行ToNumber处理
console.log(true == '2')

// 4.对象与非对象 看规范第8、9步 对象调用ToPrimitive
console.log(['42'] == 42)
// 以这个例子为例，会使用 ToPrimitive 处理 ['42']，调用valueOf，返回对象本身，再调用 toString，返回 '42'
// 到此为止，我们已经看完了2、3、4、5、6、7、8、9步，其他的一概返回false

console.log(undefined == false) // false,不满足所有条件，直接返回false
console.log([] == false) // true false=>0 ==>0==[] ==>0==''
console.log([] != ![]) // true 先![]=>false 相当于[]==false 回到上面的比较步骤

// 容易踩坑 (以下结果均为true)
console.log(false == '0') // false=>0
console.log(false == 0) // 同上
console.log(false == '') // 同上

console.log('' == 0) // ""=>0
console.log([] == '') // []=>""

console.log([] == 0) // []=>"0" ==>"0"==0 ==>0==0

console.log([null] == '') // [null]先取valueOf[null],在toString=>''
console.log(0 == '\n') // Number("\n")=>0
console.log([] == 0) // []=>'' ==>''==0 ==>0==0
