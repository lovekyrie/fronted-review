const data = { text: 'hello world' }

const bucket = new Set()
const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect)
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
function effect() {
  document.body.textContent = obj.text
}

effect()

// 1秒后修改响应式数据
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
