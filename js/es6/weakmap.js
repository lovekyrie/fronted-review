// 特性
// 1.WeakMap只接受对象作为键名
const map = new WeakMap()
map.set(1, 2) // TypeError: Invalid value used as weak map key
map.set(null, 2) // 同上

// 2.WeakMap的键名所引用的对象是弱引用
/*
  通过：强弱类型引用的垃圾回收机制可以得出：
  也正是因为这样的特性， WeakMap 内部有多少个成员， 取决于垃圾回收机制有没有运行，
 运行前后很可能成员个数是不一样的， 而垃圾回收机制何时运行是不可预测的， 因此 ES6 规定 WeakMap 不可遍历。
所以 WeakMap 不像 Map， 一是没有遍历操作（ 即没有keys()、 values() 和entries() 方法），
 也没有 size 属性， 也不支持 clear 方法，
所以 WeakMap只有四个方法可用： get()、 set()、 has()、 delete()。
 */

// 应用
// 1.在DOM对象上保存相关数据
/* 传统使用 jQuery 的时候， 我们会通过 $.data() 方法在 DOM 对象上储存相关信息(就比如在删除按钮元素上储存帖子的 ID 信息)，
jQuery 内部会使用一个对象管理 DOM 和对应的数据， 当你将 DOM 元素删除， DOM 对象置为空的时候，
 相关联的数据并不会被删除， 你必须手动执行 $.removeData() 方法才能删除掉相关联的数据， WeakMap 就可以简化这一操作：
 */
const wm = new WeakMap()
let element = document.querySelector('.element')
wm.set(element, 'data')

const value = wm.get(element)
console.log(value) // data

element.parentNode.removeChild(element)
element = null

// 2.数据缓存
/* 当我们需要关联对象和数据， 比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，
 而又不想管理这些数据的死活时非常适合考虑使用 WeakMap。 数据缓存就是一个非常好的例子： */
const cache = new WeakMap()

function countOwnKeys(obj) {
  if (cache.has(obj)) {
    console.log('Cached')
    return cache.get(obj)
  }
  else {
    console.log('Computed')
    const count = Object.keys(obj).length
    cache.set(obj, count)
    return count
  }
}
// 3.私有属性 es6有多种方式实现私有变量，这只是其中一种
const privateData = new WeakMap()

class Person {
  constructor(name, age) {
    privateData.set(this, {
      name,
      age,
    })
  }

  getName() {
    return privateData.get(this).name
  }

  getAge() {
    return privateData.get(this).age
  }
}
export default Person
