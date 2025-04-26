// css 中经常有类似 background-image 这种通过 - 连接的字符，通过 javascript 设置样式的时候需要将这种样式转换成 backgroundImage 驼峰格式，请完成此转换功能
// 1. 以 - 为分隔符，将第二个起的非空单词首字母转为大写
// 2. -webkit-border-image 转换后的结果为 webkitBorderImage
// 3. 只需要转换 key，value 不变

function cssStyle2DomStyle(sName) {
  return sName.replace(/^-/, '').replace(/-(\w)/g, (_, $1) => $1.toUpperCase())
}

console.log(cssStyle2DomStyle('background-image'))
console.log(cssStyle2DomStyle('-webkit-border-image'))
