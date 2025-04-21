const { loadImg, urlIds } = require('./index')

async function loadImgOneByOn() {
  for (const i of urlIds) {
    await loadImg(urlIds[i])
  }
}
loadImgOneByOn()
