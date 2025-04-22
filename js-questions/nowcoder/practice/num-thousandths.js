function _comma(number) {
  // 补全代码
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const num = 123456789
console.log(_comma(num))
console.log(_comma(123))

// js api
console.log(num.toLocaleString())

console.log(new Intl.NumberFormat().format(num))

// 用点分割，然后对array[0]反转 每隔3位插入一个逗号，最后反转回来
