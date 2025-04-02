import Promise from './promise.js'

const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('data')
  }, 1000)
})

promise.then((res) => {
  console.log(res)
})
promise.then((res) => {
  console.log(`继续输出结果，${res}`)
})
console.log(1)

const data = {
  stage: 'git flow',
  course: { title: 'fronter-review ' },
}
const str = 'fsdjf {{stage}} {{course.title}} gdfjkdfj'
const reg = /\{\{(.*?)\}\}/g
const replacedStr = str.replace(reg, (matched, placeholder) => {
  console.log(placeholder, 'placeholder')
  return placeholder.split('.').reduce((prev, key) => prev[key], data)
})
console.log(replacedStr)
