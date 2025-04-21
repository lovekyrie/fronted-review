// 与变量结构结合
const func = ({ value, num }) => ({ total: value * num })
// 使用
var result = func({
  value: 10,
  num: 10,
})
console.log(result)

/* 总结： a non-method function
  method:A method is a function which is a property of an object.
  (对象属性中的函数称为method)
*/
const obj = {
  i: 10,
  b: () => {
    console.log(this.i, this) // undefined,window
  },
  c() {
    console.log(this.i, this) // 10,obj
  },
}
obj.b()
obj.c()

function Button(id) {
  this.element = document.querySelector(`#${id}`)
  this.bindEvent()
}

Button.prototype.bindEvent = function () {
  // 不会生效，此时的this.setBgColor中的this指向的是this.element
  this.element.addEventListener('click', this.setBgColor, false)
  // es5 想要在this.setBgColor中的this正确指向实例的话，需要bind()改变this指向
  this.element.addEventListener('click', this.setBgColor.bind(this), false)
  // es6 箭头函数没有this,它的this指向上层方法的this值
  this.element.addEventListener(
    'click',
    event => this.setBgColor(event),
    false,
  )
}

Button.prototype.setBgColor = function () {
  this.element.style.backgorundColor = '#1abc9c'
}

const button = new Button('button')

// eg1. 因为箭头函数没有this,所以不能用call()、apply()、bind()这些方法改变this的指向
const value = 1
var result = (() => this.value).bind({ value: 2 })()
console.log(result) // 需要在浏览器环境下执行

// eg2 .没有arguments (1)可以访问外层arguments,前提不是箭头函数 (2)如何访问?命名参数和rest参数形式
function constant() {
  return () => arguments[0]
}
const result1 = constant(1)
console.log(result1())

const num = (...nums) => nums

// eg3.不能通过new关键字调用 JavaScript 函数有两个内部方法：[[Call]] 和 [[Construct]]
/* 1.当通过new调用函数时，执行[[Construct]]方法，创建一个实例对象，然后在执行函数体，最后将this绑定到实例上
   2.当直接调用的时候，执行[[call]]方法，直接执行函数体
因为箭头函数没有[[Construct]] */
function Foo() {}
const foo = new Foo() // Uncaught TypeError: Foo is not a constructor

// eg4. 没有new.target 关于new.target 看文章：http://es6.ruanyifeng.com/#docs/class#new-target-%E5%B1%9E%E6%80%A7

// eg5. 没有原型 由于不能用new调用，所以也没有构造原型的需求，于是箭头函数也不存在prototype属性
console.log(Foo.prototype) // undefined

// eg6. 没有super 连原型都没有
// 自然也不能通过 super 来访问原型的属性，所以箭头函数也是没有 super 的，不过跟 this、arguments、new.target 一样，这些值由外围最近一层非箭头函数决定。
