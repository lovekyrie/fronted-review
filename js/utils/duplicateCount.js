function duplicateCount(text) {
  // ...
  const set = new Set()
  text.toLowerCase().split('').reduce((acc, next) => {
    if (acc.includes(next)) {
      set.add(next)
    }
    return acc.concat(next)
  }, [])
  return set.size
}

console.log(duplicateCount('Indivisibility'))

// best practice
function duplicateCount1(text) {
  return (text.toLowerCase().split('').sort().join('').match(/([\s\S])\1+/g) || []).length
}

console.log(('aaabbccc').match(/([\s\S])\1+/g))
