// 逻辑与返回第一个是 false 的操作数 或者 最后一个是 true的操作数
// ps:如果某个操作数为 false，则该操作数之后的操作数都不会被计算
console.log(1 && 2 && 0) // 0
console.log(1 && 0 && 1) // 0
console.log(1 && 2 && 3) // 3

// 逻辑或返回第一个是 true 的操作数 或者 最后一个是 false的操作数
// ps: 如果某个操作数为 true，则该操作数之后的操作数都不会被计算
console.log(1 || 2 || 0) // 1
console.log(0 || 2 || 1) // 2
console.log(0 || 0 || false) // false

// 如果逻辑与和逻辑或作混合运算，则逻辑与的优先级高：
// ps: 直接写eslint校验不通过
console.log((1 && 2) || 0) // 2
console.log(0 || (2 && 1)) // 1
console.log((0 && 2) || 1) // 1
