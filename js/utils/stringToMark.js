const str = 'f4934349394394941234'
const regex = /^(.*)(.{4})$/
// 方式1
const result = str.replace(regex, (match, p1, p2) => {
  return '#'.repeat(p1.length) + p2
})
console.log(str.match(regex))
console.log(result) // 输出: "##########################1234"

// 方式2
console.log(str.replace(/.(?=.{4})/g, '#'))

// 方法3
console.log('#'.repeat(str.slice(0, -4).length) + str.slice(-4))

// 方法4
console.log(str.slice(-4).padStart(str.length, '#'))
