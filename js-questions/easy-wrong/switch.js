// switch是严格比较
function showCase(value) {
  switch (value) {
    case 'A':
      console.log('Case A')
      break
    case 'B':
      console.log('Case B')
      break
    case undefined:
      console.log('undefined')
    default:
      console.log('Do not know!')
    // break;
  }
}
showCase(new String('A')) // 'Do not know!'
showCase(String('A')) // 'Case A'
