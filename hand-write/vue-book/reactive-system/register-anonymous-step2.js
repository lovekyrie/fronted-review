let activeEffect
function effect(fn) {
  activeEffect = fn
  fn()
}

const data = { text: 'hello world' }

const bucket = new Set()
const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect)
    }
    // 返回属性值
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    // 执行副作用函数
    bucket.forEach(fn => fn())
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

// 我们这里设置obj另外一个对象属性，跟我们的副作用函数无关的get时,也会触发effect执行
// 原因就是无论读取那个属性，我们把副作用函数都收集到桶里面了。
setTimeout(() => {
  obj.noExist = 'hello Vue3'
}, 1000)
