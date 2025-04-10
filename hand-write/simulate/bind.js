// eslint-disable-next-line no-extend-native
Function.prototype.myBind = function (context, ...rest) {
  const slice = Array.prototype.slice
  const self = this
  const args = slice.apply(rest, [1])
  return function (...rest1) {
    const currentArgs = slice.apply(rest1)
    const allArgs = args.concat(currentArgs)
    return self.apply(context, allArgs)
  }
}

const User = {
  count: 1,
  getCount() {
    return this.count
  },
}

const getCount = User.getCount.myBind(User)
console.log(getCount())
