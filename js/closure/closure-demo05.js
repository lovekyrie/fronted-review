;(function (window) {
  const a = 10
  const b = 20

  const test = {
    m: 20,
    add(x) {
      return a + x
    },
    sum() {
      return a + b + this.m
    },
    mark(k, j) {
      return k + j
    },
  }

  window.test = test
})(globalThis)

console.log(test.add(100))
console.log(test.sum())
console.log(test.mark(1, 2))

const _sum = test.sum
console.log(_sum())
