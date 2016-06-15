const Promise = require('bluebird')
    , λ = require('ramda')
    , yaml = require('js-yaml')


module.exports = {

  // loader version
  version: '1.0.0',

  // match data
  matcher: {
    search: ['*.yml'],
    ignore: []
  },

  // location name
  location: 'PC',

  // analyze game by file
  analyze(game) {

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
