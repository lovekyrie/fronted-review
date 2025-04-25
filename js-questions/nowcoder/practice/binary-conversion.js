function convertToBinary(num, bit) {
  const binary = num.toString(2)
  return binary.slice(binary.length - bit, binary.length - bit + 1)
}

console.log(convertToBinary(128, 8))

// 将给定数字转换成二进制字符串。如果字符串长度不足 8 位，则在前面补 0 到满8位。
function convertToBinary2(num) {
  return num.toString(2).padStart(8, '0')
}

console.log(convertToBinary(128))

console.log(convertToBinary2(65))
