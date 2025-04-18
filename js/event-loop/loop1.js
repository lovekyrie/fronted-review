console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve(console.log('script mid'))
  .then(() => {
    console.log('promise1')
  })
  .then(() => {
    console.log('promise2')
  })

console.log('script end')
// script start => script mid => script end => promise1 => promise2 => setTimeout
