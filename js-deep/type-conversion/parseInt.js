//parseInt 只解析整数，parseFloat 则可以解析整数和浮点数，如果字符串前缀是 "0x" 或者"0X"，parseInt 将其解释为十六进制数，
//parseInt 和 parseFloat 都会跳过任意数量的前导空格，尽可能解析更多数值字符，并忽略后面的内容(非数字)。如果第一个非空格字符是非法的数字直接量，将最终返回 NaN
console.log(parseInt("3 abc")) //3
console.log(parseFloat('3.14 abc')) //3.14
console.log(parseInt('-12.34')) //-12
console.log(parseInt('0xFF')) //255
console.log(parseFloat('.1')) //0.1
console.log(parseInt('0.1')) //0