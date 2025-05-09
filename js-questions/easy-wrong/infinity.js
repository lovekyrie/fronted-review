/* Number类型只能安全地表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），
任何超出此范围的整数值都可能失去精度。 */
console.log(999999999999999) // =>10000000000000000

// 同时也会有一定的安全性问题:
9007199254740992 === 9007199254740993 // → true 居然是true!

// 从下可以得出end+1=end,因为精度丢失了，所以循环不会停止
const end = 2 ** 53 //
const start = end - 1
let count = 0
for (let i = start; i <= end; i++) {
  count++
}
console.log(count)
