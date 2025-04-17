define((require, exports, module) => {
  // 同步加载依赖模块
  const math = require('./math')

  // 导出模块接口
  exports.calculate = function (operation, a, b) {
    switch (operation) {
      case 'add':
        return math.add(a, b)
      case 'subtract':
        return math.subtract(a, b)
      case 'multiply':
        return math.multiply(a, b)
      case 'divide':
        return math.divide(a, b)
      default:
        throw new Error('Unknown operation')
    }
  }
})
