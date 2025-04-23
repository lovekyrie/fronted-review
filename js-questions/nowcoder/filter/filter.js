const cups = [
  { type: 1, price: 100, color: 'black', sales: 60, name: '牛客logo马克杯' },
  { type: 2, price: 40, color: 'blue', sales: 100, name: '无盖星空杯' },
  { type: 4, price: 60, color: 'green', sales: 200, name: '老式茶杯' },
  { type: 3, price: 50, color: 'green', sales: 600, name: '欧式印花杯' },
]
const select = document.querySelector('select')
const ul = document.querySelector('ul')
// 补全代码
select.onchange = function () {
  const options = filterMethod(select.value)
  render(options)
}

function filterMethod(value) {
  switch (value) {
    case '1':
      return cups.filter(k => k.sales < 100)
    case '2':
      return cups.filter(k => k.sales >= 100 && k.sales <= 500)
    case '3':
      return cups.filter(k => k.sales > 500)
    default:
      return cups
  }
}
function render(arr) {
  ul.innerHTML = arr.map(node => `<li>${node.name}</li>`).join('')
}
