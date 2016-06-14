const Promise = require('bluebird')


module.exports = {

  // loader version
  version: '1.0.0',

  // match data
  matcher: {
    search: ['*.yaml'],
    ignore: []
  },

  // platform data
  platform(game) {
    return 'PC'
  },

  // initialization
  initialize(file, state) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  // execution
  execute(state) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  // termination
  terminate(state) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

}
