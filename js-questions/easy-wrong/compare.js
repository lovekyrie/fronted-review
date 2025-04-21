// . VS = 操作符优先级
/**
 * .优先级高于=
 * 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
 */

let a = { n: 1 }
const b = a
a.x = a = { n: 2 } // foo.x = (foo = {n: b}) /a=(b=c)

/**
 * var foo = {z:2};
 * foo.x = foo.n = {n: 1}; //结果是：Object {z: 2, n: Object, x: Object}
 */
console.log(a.x)
console.log(b.x)
