if('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('success'))
    .catch(console.error('注册失败'))
} else {
  console.warn('浏览器不支持 serviceWorker!')
}

var style = document.createElement('style')
document.head.appendChild(style)

function get() {
  var request = new XMLHttpRequest()
  request.open('GET', 'http://127.0.0.1:1503')
  request.setRequestHeader('Authorization', 'x')
  request.onreadystatechange = function() {
    style.innerHTML = request.responseText
  }
  request.send()
}