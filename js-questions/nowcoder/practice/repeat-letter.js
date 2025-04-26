// 填写JavaScript
function containsRepeatingLetter(str) {
  // 用/([a-z])\1/i.test(str) 会比下面慢 使用i会进行字符串处理,没有穷举快
  // eslint-disable-next-line regexp/use-ignore-case
  return /([a-zA-Z])\1/.test(str)
}

function containsRepeatingLetter2(str) {
  return str.split('').some((char, index) => {
    return char === str[index + 1] && isLetter(char)
  })
}

function containsRepeatingLetter3(str) {
  const arr = str.split('')
  for (let i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) + 1 === arr.lastIndexOf(arr[i + 1]) && isLetter(arr[i])) {
      return true
    }
  }
  return false
}

function isLetter(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

console.time('containsRepeatingLetter')
console.log(containsRepeatingLetter('l33t'))
console.timeEnd('containsRepeatingLetter')

console.time('containsRepeatingLetter2')
console.log(containsRepeatingLetter2('l33t'))
console.timeEnd('containsRepeatingLetter2')

console.time('containsRepeatingLetter3')
console.log(containsRepeatingLetter3('l33t'))
console.timeEnd('containsRepeatingLetter3')
