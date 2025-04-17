define((require, exports, module) => {
  // 导出模块接口
  exports.add = function (a, b) {
    return a + b
  }

  exports.subtract = function (a, b) {
    return a - b
  }

  exports.multiply = function (a, b) {
    return a * b
  }

  exports.divide = function (a, b) {
    return a / b
  }
})
