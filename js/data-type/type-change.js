// 强制类型转换
// example1. 当存在Symbol.toPrimitive()方法时，优先调用该方法
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 2
    }
    else if (hint === 'string') {
      return '3'
    }
    else if (hint === 'default') {
      return 'default'
    }
  },
  valueOf() {
    return 1
  },
  // 默认情况下，对象的类型转换为字符串时，会调用toString()方法，如果toString()方法没有返回原始值，则调用valueOf()方法。
  // 如果valueOf()方法也没有返回原始值，则调用toString()方法。
}

console.log(String(obj)) // '3'
console.log(Number(obj)) // 2

const obj1 = {
  valueOf() {
    return 1
  },
  toString() {
    return '2'
  },
}

console.log(String(obj1)) // '2'
console.log(Number(obj1)) // 1
