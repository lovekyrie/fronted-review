// 不推荐：eval 有注入风险且难优化
const arr = [6, 4, 1, 8, 2, 11, 23]

const max = eval(`Math.max(${arr})`)
console.log(max)
