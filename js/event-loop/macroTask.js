/* eslint-disable vars-on-top */
/* eslint-disable no-var */
// for example. if don't use setTimeout
for (var i = 0; i < 5; i++) {
  console.log(i)
}

// use setTimeout. The result will change.
// because the interator is sync. the setTimeout is async execute until
// the sync task complete
for (var index = 0; index < 5; index++) {
  setTimeout(() => {
    console.log(index)
  }, 0)
}

// solve it (只在浏览器环境生效)
for (var idx = 0; idx < 5; idx++) {
  setTimeout((function (i) {
    console.log(i)
  }(idx)), 0)
}
