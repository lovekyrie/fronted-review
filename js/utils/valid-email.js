/* eslint-disable regexp/no-unused-capturing-group */
const reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/
const email = 'fengdurant@163.com'

console.log(reg.test(email))
