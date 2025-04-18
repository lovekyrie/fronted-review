const func1 = () => new Promise(resolve => setTimeout(() => resolve(5), 50))
const func2 = () => new Promise(resolve => setTimeout(() => resolve(6), 150))
const func3 = () => new Promise(resolve => setTimeout(() => resolve(7), 100))
console.log('for interator print')
for (let index = 0; index < 10; index++) {
  if (index === 5) {
    func1().then(res => console.log((`for:${res}`)))
  }
  else if (index === 6) {
    func2().then(res => console.log((`for:${res}`)))
  }
  else if (index === 7) {
    func3().then(res => console.log((`for:${res}`)))
  }
  else {
    console.log(index)
  }
}

// forEach
console.log('forEach print')
const arr = Array.from({ length: 10 }).fill(null).map((_i, i) => i)
arr.forEach((i, index) => {
  if (index === 5) {
    func1().then(res => console.log((`forEach:${res}`)))
  }
  else if (index === 6) {
    func2().then(res => console.log((`forEach:${res}`)))
  }
  else if (index === 7) {
    func3().then(res => console.log((`forEach:${res}`)))
  }
  else {
    console.log(index)
  }
})
