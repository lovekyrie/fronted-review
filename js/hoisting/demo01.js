// if you declare it inside a block, like an if statement or a for loop, 
// it's still accessible outside that block. might cause issues with unintended variable hoisting or leaks.
for (var a = 1; a < 5; a++) {}
console.log(a)

if (a === 5) {
  var b = 6
}
console.log(b)
