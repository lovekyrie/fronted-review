function* generator(i) {
  console.log('inside before')
  yield i
  yield i + 10
  console.log('inside after')
}

const gen = generator(10)
console.log('outside before')
console.log(gen.next().value)
console.log(gen.next().value)
console.log('outside after')
// gen.next()
