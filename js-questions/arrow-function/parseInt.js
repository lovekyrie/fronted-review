let unary = (fn) => (val) => fn(val);
let parse = unary(parseInt);
console.log(["1.1", "2", "0.3"].map(parse));

// fn=>val 结果[1,NaN,0]
// val=>fn(val)
Array.prototype.map(function (item, index) {
  return parse(item, index);
});

/* 对于unary不理解的可以参考arrow-clourse.js;
 */
//这里的fn就是parseInt
var unary = function (fn) {
  var fn = fn;
  return function (val) {
    return fn(val);
  };
};
//所以上面的console.log里面的最终结果为 ['1','2','0.3'].map(parseInt(val))
