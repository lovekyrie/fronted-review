//手写实现bind

Function.prototype.bind2 = function (context) {
  if (typeof this !== "function") {
    throw new Error("this is not function!");
  }
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  //中转用，防止赋值两遍的prototype都改变，例如：fBound.prototype=this.prototype
  var FUNC = function () {};
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof FUNC ? this : context,
      args.concat(bindArgs)
    );
  };

  FUNC.prototype = this.prototype;
  fBound.prototype = new FUNC();

  return fBound;
};

var value = 2;

var foo = {
  value: 1,
};

function bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = "kevin";

var bindFoo = bar.bind2(foo, "daisy");

var obj = new bindFoo("18");
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
