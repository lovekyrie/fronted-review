function findMissingLetter(array) {
  for (let i = 0; i < array.length; i++) {
    if (asciiToNumber(array[i]) !== asciiToNumber(array[i + 1]) - 1) {
      return String.fromCharCode(asciiToNumber(array[i + 1]) - 1)
    }
  }
  return ' '
}

// ASCII码转数字的示例
function asciiToNumber(char) {
  return char.charCodeAt(0)
}

console.log(findMissingLetter(['a', 'b', 'c', 'd', 'f']))
console.log('a的ASCII码是:', asciiToNumber('a')) // 输出: 97
console.log('A的ASCII码是:', asciiToNumber('A')) // 输出: 65
console.log('1的ASCII码是:', asciiToNumber('1')) // 输出: 49
