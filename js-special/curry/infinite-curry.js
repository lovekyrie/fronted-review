function sum(a) {
  return function (b) {
    if (b)
      return sum(a + b)
    return a
  }
}

const sumArrow = a => b => b ? sumArrow(a + b) : a

console.log(sum(1)(2)(3)(4)())
console.log(sumArrow(1)(2)(3)(4)())
