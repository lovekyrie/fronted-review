function toUpperCase(x) {
  return x.toUpperCase()
}
function hello(x) {
  return `HELLO, ${x}`
}
function greet(x) {
  return hello(toUpperCase(x))
}
console.log(greet('kevin'))

export { hello, toUpperCase }
