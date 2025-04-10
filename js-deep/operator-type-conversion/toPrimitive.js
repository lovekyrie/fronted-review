/**
 * 对象转原始类型：会调用内置的[toPrimitive]函数，对于该函数，其逻辑如下：
 *  1.如果有Symbol.toPrimitive方法，优先调用并返回
 *  2.调用valueOf(),如果转换为原始类型，则返回
 *  3.调用toString(),如果转换为原始类型，则返回
 *  4.如果都没有返回原始类型，报错
 */

var obj = {
  value: 3,
  valueof() {
    return 4;
  },
  toString() {
    return "5";
  },
  [Symbol.toPrimitive]() {
    return 6;
  },
};
console.log(obj + 1);

// 应用：如果让if(a==1&&a==2)条件成立
var a = {
  value: 0,
  valueOf() {
    this.value++;
    return this.value;
  },
};
console.log(a == 1 && a == 2);
