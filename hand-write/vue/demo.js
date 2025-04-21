import Vue from './Vue.js'

const o = new Vue({
  data: {
    test: 'I am test',
  },
})
o._data.test = 'hello, world'
