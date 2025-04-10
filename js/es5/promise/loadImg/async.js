const { loadImg, urlIds } = require('./index')

const loadImgOneByOn = async () => {
  for (let i of urlIds) {
    await loadImg(urlIds[i])
  }
}
loadImgOneByOn()
