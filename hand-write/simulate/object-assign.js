//复制对象
// 启用严格模式
"use strict";
const isComplexDataType = (obj) =>
  (typeof obj === "function" || typeof obj === "object") && obj !== null;

const selfAssign = function (target, ...source) {
  if (target == null)
    throw new TypeError("Cannot convert null or undefined to Object");
  return source.reduce((acc, cur) => {
    isComplexDataType(acc) || (acc = new Object(acc)); //相当于acc=isComplexDataType(acc)?acc:new Object(acc)
    if (cur == null) return acc;
    [...Object.keys(cur), ...Object.getOwnPropertySymbols(cur)].forEach(
      (key) => {
        acc[key] = cur[key];
      }
    );
    return acc;
  }, target);
};

Object.selfAssign ||
  Object.defineProperty(Object, "selfAssign", {
    value: selfAssign,
    configurable: true,
    writable: false,
    enumerable: false,
  });

let target = {
  a: 1,
  b: 1,
};

let obj1 = {
  a: 2,
  b: 2,
  c: undefined,
};

let obj2 = {
  a: 3,
  b: 3,
  [Symbol("a")]: 3,
  d: null,
};
console.log(Object.selfAssign(target, obj1, obj2));
console.log(Object.selfAssign("abd", null, undefined));
