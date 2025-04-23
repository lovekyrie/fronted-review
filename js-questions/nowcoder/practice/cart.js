// 实现购物车
const chicken = {
  name: '炸鸡',
  price: 28,
}

const cola = {
  name: '可乐',
  price: 5,
}

const cart = {
  chickenCount: 0,
  colaCount: 0,
}

const cartProxy = new Proxy(cart, {
  set(target, key, value) {
    if (value !== target[key]) {
      target[key] = value
      calcTotal()
    }
  },
})

const chickenDown = document.querySelector('#zjtaiduola')
const chickenUp = document.querySelector('#zjtaishaola')
const colaDown = document.querySelector('#kltaiduola')
const colaUp = document.querySelector('#kltaishaola')
const chickenCount = document.querySelector('#zjsl')
const colaCount = document.querySelector('#klsl')
const total = document.querySelector('#total')

chickenDown.addEventListener('click', () => {
  cartProxy.chickenCount--
  chickenCount.textContent = cartProxy.chickenCount
})

chickenUp.addEventListener('click', () => {
  cartProxy.chickenCount++
  chickenCount.textContent = cartProxy.chickenCount
})

colaDown.addEventListener('click', () => {
  cartProxy.colaCount--
  colaCount.textContent = cartProxy.colaCount
})

colaUp.addEventListener('click', () => {
  cartProxy.colaCount++
  colaCount.textContent = cartProxy.colaCount
})

function calcTotal() {
  total.textContent = chicken.price * cartProxy.chickenCount + cola.price * cartProxy.colaCount
}
