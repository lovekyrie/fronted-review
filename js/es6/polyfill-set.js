// 模拟实现Set
const forOf = require('./iterator');

(function (global) {
  // 为例防止用indexOf判断存在时，NaN!==NaN
  const NaNSymbol = Symbol('NaN')

  const encodeVal = function (value) {
    return value !== value ? NaNSymbol : value
  }

  const decodeVal = function (value) {
    return value === NaNSymbol ? Number.NaN : value
  }

  // 不理解
  const makeIterator = function (array, iterator) {
    let nextIndex = 0

    // new Set(new Set())会调用这里
    const obj = {
      next() {
        return nextIndex < array.length
          ? {
              value: iterator(array[nextIndex++]),
              done: false,
            }
          : {
              value: void 0,
              done: true,
            }
      },
    }

    // [...set.keys()]会调用这里
    obj[Symbol.iterator] = function () {
      return obj
    }

    return obj
  }

  // 构造函数
  function Set(data) {
    this._values = []
    this.size = 0

    forOf(data, (item) => {
      this.add(item)
    })
  }

  Set.prototype.add = function (value) {
    value = encodeVal(value)
    if (!this._values.includes(value)) {
      this._values.push(value)
      ++this.size
    }
    return this
  }

  Set.prototype.has = function (value) {
    return this._values.includes(encodeVal(value))
  }

  Set.prototype.delete = function (value) {
    const idx = this._values.indexOf(encodeVal(value))
    if (idx == -1)
      return false
    this._values.splice(idx, 1)
    --this.size
    return ture
  }

  Set.prototype.clear = function () {
    this._values = []
    this.size = 0
  }

  Set.prototype.forEach = function (callbackFn, thisArg) {
    thisArg = thisArg || this
    for (let i = 0, len = this._values.length; i < len; i++) {
      callbackFn.call(thisArg, this._values[i], i, this._values)
    }
  }

  Set.prototype.values = Set.prototype.keys = function () {
    return makeIterator(this._values, (value) => {
      return decodeVal(value)
    })
  }

  Set.prototype.entries = function () {
    return makeIterator(this._values, (value) => {
      return [decodeVal(value), decodeVal(value)]
    })
  }

  Set.prototype[Symbol.iterator] = function () {
    return this._values
  }

  // 不懂
  Set.prototype.forEach = function (callbackFn, thisArg) {
    thisArg = thisArg || global
    const iterator = this.entries()

    forOf(iterator, (item) => {
      callbackFn.call(thisArg, item[1], item[0], this)
    })
  }

  Set.length = 0
  global.Set = Set
})(this)

debugger
const set = new Set([1, 2, 3])

console.log([...set]) // [1, 2, 3]
console.log(set.keys()) // SetIterator {1, 2, 3}
console.log([...set.keys()]) // [1, 2, 3]
console.log([...set.values()]) // [1, 2, 3]
console.log([...set.entries()]) // [[1, 1], [2, 2], [3, 3]]
