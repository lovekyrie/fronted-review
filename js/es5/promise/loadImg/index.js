const urlIds = [1, 2, 3, 4, 5]

function loadImg(urlId) {
  const url = `https://www.image.com/${urlId}`

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = function () {
      reject(urlId)
    }

    img.onload = function () {
      resolve(urlId)
    }
    img.src = url
  })
}

module.exports = { loadImg, urlIds }
