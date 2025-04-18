const len = 117
const func = {
  len: 935,
  showLen() {
    console.log(this.len)
  },
  show() {
    (function (cb) {
      cb()
    })(this.showLen)
  },
}

func.showLen()
