// 填写JavaScript
function iterate(obj) {
  return Object.keys(obj).map((key) => {
    return `${key}: ${obj[key]}`
  })
}
