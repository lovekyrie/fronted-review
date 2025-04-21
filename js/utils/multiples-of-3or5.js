function solution(number) {
  if (number < 0)
    return 0
  // 返回所有3或5的倍数之和
  return Array.from({ length: number }, (_, i) => i).filter(i => i % 3 === 0 || i % 5 === 0).reduce((acc, curr) => acc + curr, 0)
}

console.time('solution')
console.log(solution(100))
console.timeEnd('solution')

// best practice (一次循环比两次循环真的差好多)
function solution1(number) {
  let sum = 0
  for (let i = 0; i < number; i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      sum += i
    }
  }
  return sum
}

console.time('solution1')
console.log(solution1(100))
console.timeEnd('solution1')
