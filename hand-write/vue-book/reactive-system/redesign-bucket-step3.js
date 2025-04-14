let activeEffect
function effect(fn) {
  activeEffect = fn
  fn()
}

const data = { text: 'hello world' }

// 这里为什么要用weakmap数据结构的原因，可以参照js/data-structure
const bucket = new WeakMap()
const obj = new Proxy(data, {
  get(target, key) {
    if (!activeEffect)
      return
    // 从桶中根据target取出map结构
    let depMaps = bucket.get(target)
    if (!depMaps) {
      bucket.set(target, (depMaps = new Map()))
    }
    // 从map结构中根据key取出副作用函数
    let deps = depMaps.get(key)
    if (!deps) {
      depMaps.set(key, (deps = new Set()))
    }
    // 最后，将当前激活的副作用函数添加到桶里（deps)
    deps.add(activeEffect)
    // 返回属性值
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    const depMaps = bucket.get(target)
    if (!depMaps)
      return
    const effects = depMaps.get(key)
    // 执行副作用函数
    effects && effects.forEach(fn => fn())
    // 返回true代表设置操作成功
    return true
  },
})

effect(() => {
  console.log('effect run')
  document.body.textContent = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

setTimeout(() => {
  obj.noExist = 'hello Vue3'
}, 1000)
