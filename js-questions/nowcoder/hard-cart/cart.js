const tfoot = document.querySelector('#jsTrolley tfoot')
const tbody = document.querySelector('#jsTrolley tbody')
function add(items) {
  // 添加商品
  // 1. 获取商品名称和价格
  // 2. 将商品名称和价格添加到购物车中
  items.forEach((item) => {
    const tbody = document.querySelector('#jsTrolley tbody')
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${item.name}</td><td>${item.price}</td><td><a href="javascript:void(0);">删除</a></td>`
    tbody.appendChild(tr)
  })
  renderTotal()
}

function remove() {
  // 删除商品 (使用事件委托)
  // 1. 获取商品名称
  // 2. 从购物车中删除商品
  tbody.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      const tr = e.target.closest('tr')
      tr.remove()
      renderTotal()
    }
  })
}
remove()
function renderTotal() {
  const total = Array.from(tbody.children).reduce((acc, item) => acc + Number(item.children[1].textContent), 0)
  tfoot.innerHTML = `<th>总计</th><td colspan="2">${total.toFixed(2)}(${tbody.children.length}件商品)</td>`
}

const addBtn = document.querySelector('#jsAdd')
addBtn.addEventListener('click', () => {
  add([{ name: '商品1', price: 10.1 }, { name: '商品2', price: 20.2 }, { name: '商品3', price: 30.3 }])
})
