// 将 rgb 颜色字符串转换为十六进制的形式，如 rgb(255, 255, 255) 转为 #ffffff
// 1. rgb 中每个 , 后面的空格数量不固定
// 2. 十六进制表达式使用六位小写字母
// 3. 如果输入不符合 rgb 格式，返回原始输入

function rgb2hex(sRGB) {
  if (!/^rgb\(((\s)*\d{1,3}),((\s)*\d{1,3}),((\s)*\d{1,3})\)$/.test(sRGB)) {
    return sRGB
  }
  return `#${getHex(sRGB)}`
}

function getHex(str) {
  return str.match(/\d{1,3}/g).map((num) => {
    const hex = Number(num).toString(16)
    return '0'.repeat(2 - hex.length) + hex
  }).join('')
}

console.log(rgb2hex('rgb(255,255,100)'))
