const b = 10;
(function b() {
  // 'use strict'
  b = 20
  console.log(b)
})();

/**
 * 如标题一样，非匿名自执行函数，函数名不可以修改，严格模式下会TypeError，
 * 非严格模式下，不报错，修改也没有用。
 * 查找变量b时,立即执行函数会有内部作用域，会先去查找是否有b变量的声明，有的话，直接赋值
 * 确实发现了具名函数Function b(){} 所以就拿来做b的值
 * IIFE的函数内部无法进行赋值(类似于const)
 */

// 第二种情况
(function () {
  // 'use strict'
  const b = 20
  console.log(window.b) // 在浏览器环境下运行 10
  console.log(b)
})()
