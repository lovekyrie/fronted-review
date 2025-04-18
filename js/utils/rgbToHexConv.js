// best practice
function rgbToHex(r, g, b) {
  return [r, g, b].map(toHex).join('')
}

function toHex(num) {
  if (num < 0)
    return '00'
  if (num > 255)
    return 'FF'
  return num.toString(16).padStart(2, '0').toUpperCase()
}

console.log(rgbToHex(255, 255, 300))
