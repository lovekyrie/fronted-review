function _getExFilename (filename) {
   // 补全代码
   return filename.match(/\.[^.]+$/)[0]
}

console.log(_getExFilename('test.txt'))
console.log(_getExFilename('test.txt.zip'))

