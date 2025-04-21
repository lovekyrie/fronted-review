// if you declare it inside a block, like an if statement or a for loop, 
// it's still accessible outside that block. might cause issues with unintended variable hoisting or leaks.
for (var a = 1; a < 5; a++) {}
console.log(a)

if (a === 5) {
  var b = 6 // 这里var b = undefined会提升到顶部作用域，当a === 5的时候，对b进行赋值，b = 6,如果不满足条件，那么b就是undefined
}
console.log(b)
