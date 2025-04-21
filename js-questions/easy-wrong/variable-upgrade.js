// 变量提升
const name = 'World!';
(function () {
  if (typeof name === 'undefined') {
    var name = 'Jack'
    console.log(`Goodbye ${name}`)
  }
  else {
    console.log(`Hello ${name}`)
  }
})();
// var 变量提升 因为ES5只有全局作用域跟函数作用域，并没有ES6的{}'会计作用域' 代码相当于；
(function () {
  let name
  if (typeof name === 'undefined') {
    name = 'jack'
    console.log(`Goodbay ${name}`)
  }
  else {
    console.log(`Hello ${name}`)
  }
})();
// 如果改成let声明呢 不会提升，所以typeof name的 name就是World
(function () {
  if (typeof name === 'undefined') {
    const name = 'Jack'
    console.log(`Goodbye ${name}`)
  }
  else {
    console.log(`Hello ${name}`)
  }
})()
