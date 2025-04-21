// es6引入了一种新的数据类型Symbol,表示独一无二的值
// 1.Symbol值通过Symbol生成，使用typeof，结果为"symbol"
let s = Symbol()
console.log(typeof s)
// 2.Symbol不能通过new调用，否则报错。因为生成的Symbol类型数据是原始类型，不是对象

// 3. instanceof 结果为false
s = Symbol('foo')
console.log(s instanceof Symbol)

// 4. Symbol接受字符串为参数，表示对Symbol实例的描述，便于在控制台显示、或者转为字符串时好区分
console.log(s) // Symbol(foo)

// 5. 如果Symbol参数为对象，则先调用toString,再生成一个Symbol值
const obj = {
  toString() {
    return 'abc'
  },
}
const sym = Symbol(obj)
console.log(sym) // Symbol(abc)

// 6. Symbol参数只是对当前Symbol值的描述，永不相等。因为Symbol如其名，独一无二
let s1 = Symbol()
let s2 = Symbol()
console.log(s1 === s2)

s1 = Symbol('foo')
s2 = Symbol('foo')
console.log(s1 === s2)

// 7. 值不能与其他数据类型就行运算，会报错
const sym1 = Symbol('My symbol')
// console.log("your symbol is " + sym1); // TypeError:Cannot convert value to a string

// 8. Symbol值可以显式转为字符串'
console.log(String(sym1)) // 'Symbol(My symbol)'
console.log(sym1.toString()) // 'Symbol(My symbol)'

// 9. 可以作为标识符，用于对象的属性名，可以保证属性名不重复
const mySymbol = Symbol()
// 第一种
let a = {}
a[mySymbol] = 'hello'
// 第二种
a = {
  [mySymbol]: 'hello',
}
// 第三种
a = {}
Object.defineProperty(a, mySymbol, { value: 'hello' })
// 以上写法都能得到同样的结果
console.log(a[mySymbol])

// 10. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。
// 但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。
const object = {}
const key1 = Symbol('a')
const key2 = Symbol('b')

object[key1] = 'Hello'
object[key2] = 'World'

const objectSymbols = Object.getOwnPropertySymbols(object)

console.log(objectSymbols) // [Symbol(a), Symbol(b)]

// 11.如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。
// 如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值
const same1 = Symbol.for('foo')
const same2 = Symbol.for('foo')
console.log(same1 === same2) // true

// 12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。
s1 = Symbol.for('foo')
console.log(Symbol.keyFor(s1)) // "foo"

s2 = Symbol('foo')
console.log(Symbol.keyFor(s2)) // undefined
