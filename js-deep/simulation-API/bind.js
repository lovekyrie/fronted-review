// 手写实现bind

Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not function!')
  }
  const self = this
  const args = Array.prototype.slice.call(arguments, 1)

  // 中转用，防止赋值两遍的prototype都改变，例如：fBound.prototype=this.prototype
  const FUNC = function () {}
  const fBound = function () {
    const bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(
      this instanceof FUNC ? this : context,
      args.concat(bindArgs),
    )
  }

  FUNC.prototype = this.prototype
  fBound.prototype = new FUNC()

  return fBound
}

const value = 2

const foo = {
  value: 1,
}

function bar(name, age) {
  this.habit = 'shopping'
  console.log(this.value)
  console.log(name)
  console.log(age)
}

bar.prototype.friend = 'kevin'

const bindFoo = bar.bind2(foo, 'daisy')

const obj = new bindFoo('18')
// undefined
// daisy
// 18
console.log(obj.habit)
console.log(obj.friend)
