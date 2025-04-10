//最常见的深拷贝 JSON.parse(JSON.stringify(obj)),但是有一个问题，不能拷贝函数
var arr = [
  function () {
    console.log(a);
  },
  {
    b: function () {
      console.log(b);
    },
  },
];

var newArr = JSON.parse(JSON.stringify(arr));
console.dir(newArr);
