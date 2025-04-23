const text = document.querySelector('.text')
const search = document.querySelector('input')
const btn = document.querySelector('button')
btn.onclick = () => {
  // 补全代码
  // 清空上一次的搜索结果
  text.innerHTML = text.innerHTML.replace(/<b style="color: yellow">.*?<\/b>/g, '')
  const str = search.value
  const reg = new RegExp(str, 'g')
  text.innerHTML = text.innerHTML.replace(reg, `<b style="color: yellow">${str}</b>`)
}
