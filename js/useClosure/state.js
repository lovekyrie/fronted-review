;(function () {
  // 私有变量
  var states = {}

  var toString = Object.prototype.toString
  // 判断数据类型
  function getType(elem) {
    if (elem == null) {
      return elem + ''
    }
    return toString
      .call(elem)
      .replace(/[\[\]]/g, '')
      .split(' ')[1]
      .toLowerCase()
  }

  /**
   *  通过属性名获取保存在states中的值
   * @param {*} name 属性名
   * @returns
   */
  function get(name) {
    return states[name] ? states[name] : ''
  }

  function getStates() {
    return states
  }

  /**
   * 通过传入键值对的方式修改state树，使用方式与小程序的data或者react中的setStates类似
   * @param {*} options 键值对
   * @param {*} target 属性值为对象的属性，只在函数实现时递归中传入
   */
  function set(options, target) {
    var keys = Object.keys(options)
    var o = target ? target : states

    keys.map(function (item) {
      if (typeof o[item] == 'undefined') {
        o[item] = options[item]
      } else {
        typeof o[item] == 'object' ? set(options[item], o[item]) : (o[item] = options[item])
      }
      return item
    })
  }

  // 对外提供接口
  window.get = get
  window.set = set
  window.getStates = getStates
})()

// 具体使用
set({ a: 20 })
set({ b: 100 })
set({ c: 10 })

set({
  o: {
    m: 10,
    n: 20,
  },
})

// 修改
set({
  o: {
    m: 1000,
  },
})

// 给对象o增加一个c属性
set({
  o: {
    c: 100,
  },
})
console.log(getStates())
