const { loadImg, urlIds } = require('./index')

// 面向对象
function loadImgOneByOne(index) {
  const len = urlIds.length

  loadImg(urlIds[index]).then(() => {
    if (index === len - 1) {

    }
    else {
      loadImgOneByOne(++index)
    }
  })
}
loadImgOneByOn(0)
