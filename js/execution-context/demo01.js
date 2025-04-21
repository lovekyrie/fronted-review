// 浏览器call stack顺序 global context => changeColor in => swapColor in => swapColor out => changeColor out
let color = 'blue'

function changeColor() {
  let anotherColor = 'red'

  function swapColor() {
    const tempColor = anotherColor
    anotherColor = color
    color = tempColor
  }

  swapColor()
}

changeColor()
