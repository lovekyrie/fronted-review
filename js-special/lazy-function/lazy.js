//惰性函数
var foo = function () {
  var t = new Date();
  foo = function () {
    return t;
  };
  return foo();
};

var first = foo();
var second = foo();
console.log(first);
console.log(second);
