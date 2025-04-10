//模拟jquery.extend实现

const type1 = require("../type-judgment/type-upon");
var class2Type = {};
var toString = class2Type.toString;
var hasOwn = class2Type.hasOwnProperty;

function isFunction(obj) {
  return type1(obj) === "function";
}

function isPlainObject(obj) {
  var proto, Ctor;
  //如果对象不存在，或者toString不是[object Object],为false
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  //得到原型proto,如果proto为空，为true
  proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }
  //通过proto得到obj.constructor
  Ctor = hasOwn.call(proto, "consturctor") && proto.constructor;
  //判断obj.constructor是否为function,并且hasOwn.toString(obj.constructor)是否相等于hasOwn.toString(Object)
  return (
    typeof Ctor === "function" &&
    hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
  );
}

function extend() {
  //默认不深拷贝
  var deep = false;
  var name, src, copy, clone, options, copyIsArray;
  var length = arguments.length;
  //参数下标
  var i = 1;
  //如果arguments[0]不传boolean,则target赋值为它
  var target = arguments[0] || {};
  //如果arguments[0]为boolean,则target为1
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  //要复制的必须是对象&函数，如果不是设置为{}
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }
  //循环要复制的对象
  for (; i < length; i++) {
    //获取当前对象
    options = arguments[i];
    //要求当前对象不为空，避免extend(a,,b)这种情况出现
    if (options != null) {
      for (name in options) {
        //目标属性值
        src = target[name];
        //源数据属性值
        copy = options[name];
        //判断循环引用
        if (target === copy) {
          continue;
        }
        // 要递归的对象必须是 plainObject 或者数组
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          //判断源目标为对象或数组时，目标对象不是的情况
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}

var a = extend(true, [4, 5, 6, 7, 8, 9], [1, 2, 3]);
console.log(a);
