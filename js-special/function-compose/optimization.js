// 优化
// const { toUpperCase, hello } = require("./try");
import { hello, toUpperCase } from './try'

function compose(f, g) {
  return function (x) {
    return f(g(x))
  }
}

const greet = compose(hello, toUpperCase)
console.log(greet('kevin'))
