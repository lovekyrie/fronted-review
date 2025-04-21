// 最常见的深拷贝 JSON.parse(JSON.stringify(obj)),但是有一个问题，不能拷贝函数
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
