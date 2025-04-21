const daimyo = { name: 'Matsu', clan: 'takasu', armySize: 10000 }
const proxy = new Proxy(daimyo, {
  set: (target, key, value) => {
    if (key === 'armySize') {
      const number = Number.parseInt(value)
      if (!Number.isNaN(number)) {
        target[key] = number
      }
    }
    else {
      target[key] = value
    }
  },
})

console.log(daimyo.armySize === 10000)
console.log(proxy.armySize === 10000)

proxy.armySize = 'large' // 赋值失败
console.log(daimyo.armySize === 'large')

daimyo.armySize = 'large'
console.log(daimyo.armySize === 'large')
