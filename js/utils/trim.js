function trim(str) {
  if (str && typeof str === 'string')
    return str.replace(/^\s+|\s+$/, '')
}

console.log(trim('  fsdfjif    '))
