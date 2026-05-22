import { loadImg, urlIds } from './index.js'

urlIds.reduce((prevPromise, urlId) => {
  return prevPromise.then(() => loadImg(urlId))
}, Promise.resolve())
