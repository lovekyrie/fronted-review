function persistence(num) {
  // code me
  let count = 0
  while (num > 9) {
    num = num.toString().split('').reduce((acc, next) => {
      return acc * next
    }, 1)
    count++
  }
  return count
}

console.log(persistence(999))
