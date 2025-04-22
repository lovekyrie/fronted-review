// 实现全选
const all = document.getElementById('all')
const items = document.querySelectorAll('.item')

all.addEventListener('change', () => {
  items.forEach(item => item.checked = all.checked)
})

// 子项全部选择，全选框也选中
items.forEach((item) => {
  item.addEventListener('change', () => {
    all.checked = Array.from(items).every(item => item.checked)
  })
})
