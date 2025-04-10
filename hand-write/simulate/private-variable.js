//使用proxy vue3就是用proxy重构的响应式绑定数据
const proxy = function (obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (key.startsWith('_')) {
        throw new Error('private key')
      }
      return Reflect.get(target, key)
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => !key.startsWith('_'))
    }
  })
}
// 使用Proxy代理所有含有_开头的变量，使其不能被外部访问

const Person = (function () {
  const _name = Symbol('name')

  class Person {
    constructor(name) {
      this[_name] = name
    }

    getName() {
      return this[_name]
    }
  }

  return Person
})()
//通过闭包的形式保存私有变量，缺点在于类的所有实例访问的都是同一个私有变量

class Person {
  constructor(name) {
    let _name = name
    this.getName = function () {
      return _name
    }
  }
}
/* 这种闭包方式的实现，解决了上面那种闭包的缺点，每个实例都有自己的私有变量，
缺点：舍弃了class语法的简洁性，将所有的特权方法（访问私有变量的方法）都保存在构造函数中 */

const Person = (function () {
  let wp = new WeakMap()

  class Person {
    constructor(name) {
      wp.set(this, {
        name
      })
    }
    getName() {
      return wp.get(this).name
    }
  }
  return Person
})()
/* 通过WeakMap和闭包， 在每次实例化时保存当前实例和所有私有变量组成的对象， 外部无法访问
闭包中的WeakMap， 使用WeakMap好处在于当没有变量引用到某个实例时，会自动释放这个实例
保存的私有变量，减少内存溢出的问题 */