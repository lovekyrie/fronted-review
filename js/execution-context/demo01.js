// 浏览器call stack顺序 global context => changeColor in => swapColor in => swapColor out => changeColor out 
var color = 'blue'

function changeColor() {
  var anotherColor = 'red'

  function swapColor() {
    var tempColor = anotherColor
    anotherColor = color
    color = tempColor
  }

  swapColor()
}

changeColor()