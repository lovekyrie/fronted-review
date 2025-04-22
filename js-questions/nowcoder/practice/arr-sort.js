const cups = [
  { type: 1, price: 100, color: 'black', sales: 3000, name: '牛客logo马克杯' },
  { type: 2, price: 40, color: 'blue', sales: 1000, name: '无盖星空杯' },
  { type: 4, price: 60, color: 'green', sales: 200, name: '老式茶杯' },
  { type: 3, price: 50, color: 'green', sales: 600, name: '欧式印花杯' },
]
const ul = document.querySelector('ul')
const upbtn = document.querySelector('.up')
const downbtn = document.querySelector('.down')
// 补全代码

// 初始化
renderList()

// 升序
upbtn.addEventListener('click', () => {
  cups.sort((a, b) => a.sales - b.sales)
  renderList()
})

// 降序
downbtn.addEventListener('click', () => {
  cups.sort((a, b) => b.sales - a.sales)
  renderList()
})

function renderList() {
  ul.innerHTML = cups.map(cup => `<li>${cup.name}</li>`).join('')
}
