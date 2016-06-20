const Promise = require('bluebird')
    , λ       = require('ramda')
    , yaml    = require('js-yaml')
    , fs      = Promise.promisifyAll(require('fs-extra'))

const d_image = λ.defaultTo('')
    , d_arr = λ.defaultTo([])

module.exports = {
  // loader version
  version: '1.0.0',

  // match data
  matcher: {
    search: ['*.yml'],
    ignore: [],
    location: 'PC',
  },

  // analyze game by file
  analyze(file, state) {
    return fs.readFileAsync(file, 'utf-8')
      .then(raw => {
        const game = yaml.safeLoad(raw)
        return {
          name: game.name,
          image: d_image(game.image),
          platform: 'PC',
          location: game.location,
          command: game.command,
          backup: d_arr(game.backup)
        }
      })
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
