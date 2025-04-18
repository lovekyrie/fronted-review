import observer from './observer.js'

class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

export default Vue
