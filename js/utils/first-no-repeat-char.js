function firstNonRepeatingLetter(s) {
  // Add your code here
  const lowerCase = s.toLowerCase()
  for (let i = 0; i < lowerCase.length; i++) {
    // ignore uppercase and lowercase
    if (lowerCase.indexOf(lowerCase[i]) === lowerCase.lastIndexOf(lowerCase[i])) {
      return s[i]
    }
  }
  return ''
}

console.log(firstNonRepeatingLetter('aabbcc'))
console.log(firstNonRepeatingLetter('stress'))
console.log(firstNonRepeatingLetter('sTreSS'))
console.log(firstNonRepeatingLetter('moonmen'))
