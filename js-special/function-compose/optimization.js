// 二元 compose，配合 ES Module 拆分原子函数
import { hello, toUpperCase } from './try'

function compose(f, g) {
  return function (x) {
    return f(g(x))
  }
}

const greet = compose(hello, toUpperCase)
console.log(greet('kevin'))
