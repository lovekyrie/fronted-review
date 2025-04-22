function isCard(card) {
  if (/\d{17}[0-9X]/.test(card)) {
    return true
  }
  return false
}

console.log(isCard('330127199103206312'))
console.log(isCard('1234567890123456'))
