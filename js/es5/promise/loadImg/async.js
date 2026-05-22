import { loadImg, urlIds } from './index.js'

async function loadImgOneByOn() {
  for (const i of urlIds) {
    await loadImg(urlIds[i])
  }
}
loadImgOneByOn()
