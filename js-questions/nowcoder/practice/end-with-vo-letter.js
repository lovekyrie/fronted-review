function endsWithVowel(str) {
  // eslint-disable-next-line regexp/use-ignore-case
  return /[aeiouAEIOU]/.test(str.slice(-1))
}

function endsWithVowel2(str) {
  return ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(str.slice(-1))
}

// 正则比includes慢
console.time('endsWithVowel')
console.log(endsWithVowel('gorilla'))
console.timeEnd('endsWithVowel')

console.time('endsWithVowel2')
console.log(endsWithVowel2('gorilla'))
console.timeEnd('endsWithVowel2')
