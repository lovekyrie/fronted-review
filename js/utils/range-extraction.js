function solution(list) {
  // TODO: complete solution
  let result = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i] + 1 === list[i + 1]) {
      result += `${list[i]}-`
    }
  }
}

solution([-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20])
