/**
 * 原始类型：
 *  number: 除了+0，-0，NaN为false,其他全为true
 *  string: 除了空串全为true
 *  null、undefined: false
 * 引用类型：全为true
 */

//原始值转布尔
console.log(Boolean()); //false

console.log(Boolean(false)); //false

console.log(Boolean(undefined)); //false
console.log(Boolean(null)); //false
console.log(Boolean(+0)); //false
console.log(Boolean(-0)); //false
console.log(Boolean(NaN)); //false
console.log(Boolean(""));
//注意：当Boolean函数不传任何参数时，会返回false

//对象转布尔值：所有对象（包括数组和函数）都转换为true。对于包装对象亦是
console.log(![]); //false
console.log(Boolean(new Boolean(false))); //true
