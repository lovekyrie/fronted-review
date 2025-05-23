SingleDog.getInstance = (function () {
  // 定义自由变量instance,模拟私有变量
  let instance = null
  return function () {
    // 判断自由变量是否为null
    if (!instance) {
      // 如果为null则new出唯一实例
      instance = new SingleDog()
    }
    return instance
  }
})()
