//洗牌模式 打乱数据用
function shuffle(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    let randomIndex = i + Math.floor(Math.random() * (len - i));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(shuffle(arr))

function shuffle2(arr) {
  const _arr = []
  while (arr.length) {
    let randomIndex = Math.floor(Math.random() * arr.length)
    _arr.push(arr.splice(randomIndex, 1)[0])
  }
  return _arr
}
console.log(shuffle2(arr))