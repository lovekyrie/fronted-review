// JSON 深拷贝：简单但丢 function、undefined、循环引用等
const arr = [
  function () {
    console.log(a)
  },
  {
    b() {
      console.log(b)
    },
  },
]

const newArr = JSON.parse(JSON.stringify(arr))
console.dir(newArr)
