// 单例模式  construct可以拦截通过new关键字调用这个函数的操作
function proxy(func) {
  // 注意此时instance变量在全局环境下就是一个闭包
  let instance
  const handler = {
    construct(target, args) {
      if (!instance) {
        instance = Reflect.construct(func, args)
      }
      return instance
    },
  }
  return new Proxy(func, handler)
}
// 通过ES6的proxy拦截构造函数的执行方法来实现的单例模式

function Person(name, age) {
  this.name = name
  this.age = age
}

const singletonPerson = proxy(Person)

const person1 = new singletonPerson('lzq', 30)
const person2 = new singletonPerson('zsq', 22) // 这个实例不会生效，会返回peroson1
console.log(person1 === person2)
