/* Object.defineProperty 这个api可以给一个对象添加属性以及这个属性的属性描述符/访问器（这两个不能共存，同一属性只能有其中一个）
  属性描述符有configurable,writable,enumerable,value这4个属性 意思分别为：是否可配置，是否只读，是否可枚举和属性的值
  访问器有configurable,enumerable,get,set 前两个同上，后两个都是函数，定义了get，set
  后对元素的读写操作都会执行后面的getter / setter函数, 并且覆盖默认的读写行为
*/
const obj = {}
Object.defineProperty(obj, 'a', {
  configurable: true,
  enumerable: false,
  value: '1',
  writable: false,
})

console.log(obj.a)
obj.a = 2 // 不会报错，只是不能修改掉值？
Object.keys(obj) // []

const obj2 = {}
Object.defineProperty(obj2, 'b', {
  configurable: true,
  enumerable: true,
  get() {
    return 1
  },
})

console.log(obj2.b)
obj2.b = 2 // 不会报错，只是不能修改掉值？
