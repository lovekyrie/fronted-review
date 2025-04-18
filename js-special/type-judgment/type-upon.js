//type API
var class2Type = {};
"Boolean Number String Function Array Date RegExp Object Error Null Undefined"
  .split(" ")
  .map((item, index) => {
    class2Type["[object " + item + "]"] = item.toLowerCase();
  });

function type(obj) {
  return typeof obj === "object" || typeof obj === "function"
    ? class2Type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

console.log(type(1));
console.log(type(function f() {}));
/*  但是IE6环境下，null和undefined会被Object.prototype.toString识别成[object Object],借鉴下jquery的写法：
(对结果影响的只有null，因为undefined用的是typeof) */
function type1(obj) {
  //undefined null都==null
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2Type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

module.exports = type1;
