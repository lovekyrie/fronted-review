foo(10);

function foo(num) {
  console.log(foo);
  foo = num;
  console.log(foo);
  var foo;
}
console.log(foo); //同名函数声明 跟变量，变量的声明会被忽略,
var foo = 1; //此时foo重新被赋值，不在是function foo了
console.log(foo);