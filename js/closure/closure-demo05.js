;(function (window) {
  var a = 10
  var b = 20

  var test = {
    m: 20,
    add: function (x) {
      return a + x
    },
    sum: function () {
      return a + b + this.m
    },
    mark: function (k, j) {
      return k + j
    },
  }

  window.test = test
})(globalThis)

console.log(test.add(100))
console.log(test.sum())
console.log(test.mark(1, 2))

var _sum = test.sum
console.log(_sum())
