const triangle = document.querySelector('.triangle')
for(let i = 0; i < 10; i++){
  const node = document.createElement('span')
  node.innerHTML = `${'*'.repeat(i + 1)}<br>`
  triangle.appendChild(node)
}
