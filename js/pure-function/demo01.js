/**
 * 函数式编程强调没有"副作用"，意味着函数要保持独立，所有功能就是返回一个新的值，没有其他行为，尤其是不得修改外部变量的值。
 */
var source = [1, 2, 3, 4, 5]

source.slice(1, 3) // pure. source not change
source.splice(1, 3) // no pure. source change

source.pop() // no pure
source.push(6) // no pure
source.shift() // no pure
source.unshift(1) // no pure
source.reverse() // no pure

source.concat([7, 8]) // pure
source.join('-') // pure
