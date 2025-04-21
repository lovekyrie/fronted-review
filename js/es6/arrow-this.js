/* 箭头函数
  1. 没有arguments
  2. 没有prototype属性，没有构造函数
  3. 没有自己的this (箭头函数的this始终等于它上层上下文中的this ps:上层可以理解为顶层，就上层的上层如果还是箭头函数，以此类推)
    note: 不要在可能改变this指向的函数中使用箭头函数，比如vue中的methods,computed等方法
    Vue将这些函数的this绑定了当前组件的vm实例，如果使用箭头函数会强行改变this，
    因为箭头函数优先级最高（无法再使用call,apply,bind改变指向 ps:Vue中把函数的this绑定到当前组件的vm实例，就是用到了call,apply,bind）
*/

// eg1.
const controller = {
  makeRequest() {
    setTimeout(function () {
      console.log(this.a)
    })
  },
  a: 1,
}
controller.makeRequest()
// 因为setTimeout会将一个匿名的回调函数推入异步队列，而回调函数是具有全局性的，即在非严格模式下this会指向window，就会存在丢失变量a的问题

// eg2.
const controller1 = {
  makeRequest() {
    const that = this
    setTimeout(() => {
      console.log(that.a)
    })
  },
  a: 1,
}
controller1.makeRequest()

// eg3.
const controller2 = {
  makeRequest() {
    setTimeout(() => {
      console.log(this.a) // 这里箭头函数this的上下文是makeRequest函数的执行上下文
    }, 0)
  },
  a: 1,
}
controller2.makeRequest()

// eg4.
const controller3 = {
  makeRequest: () => {
    setTimeout(() => {
      console.log(this.a) // 这里箭头函数this的上下文是调用makeRequest函数的controller3对象所在的执行上下文
    }, 0)
  },
  a: 1,
}
controller3.makeRequest()
