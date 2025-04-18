const target = {
  m() {
    console.log(this === target)
  },

}
const proxy = new Proxy(target, {})
target.m()
proxy.m()

// 当执行target.m()时，this指向target
// 当执行proxy.m()时，this指向proxy
