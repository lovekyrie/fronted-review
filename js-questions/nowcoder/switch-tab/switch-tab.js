const options = document.querySelector('.options')
const optionItems = [].slice.call(document.querySelectorAll('.options li'))
const items = [].slice.call(document.querySelectorAll('.items li'))
// 补全代码
options.addEventListener('click', (e) => {
  optionItems.forEach(item => {
    if (item.dataset.type === e.target.dataset.type) {
      item.style.backgroundColor = '#25bb9b'
      items[item.dataset.type].style.display = 'block'
    } else {
      item.style.backgroundColor = '#fff'
      items[item.dataset.type].style.display = 'none'
    }
  })
})
