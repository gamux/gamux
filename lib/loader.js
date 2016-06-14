'use strict'

const Promise = require('bluebird')
    , λ = require('ramda')
    , path = require('path')

const glob = Promise.promisify(require('glob'))

const dummy = λ.defaultTo(state => new Promise(resolve => resolve()))

function reduce(list, fn) {
  return Promise.reduce(list, fn, [])
}

module.exports = {

  initialize(state) {
    const files = reduce(state.path.loaders, (acc, folder) => {
      const applyFolder = λ.map(f => path.join(folder, f))

      return glob('*.js', { cwd: folder })
        .then(f => acc.concat(applyFolder(f)))
    })

    const loaders = Promise.map(files, f => {
      const loader = require(f)

      loader.initialize = dummy(loader.initialize).bind(loader)
      loader.execute = dummy(loader.execute).bind(loader)
      loader.terminate = dummy(loader.terminate).bind(loader)

      return loader
    })

    return Promise.map(loaders, loader => loader.initialize(state))
      .then(() => loaders)
  },

  execute(loaders, state) {
    return Promise.map(loaders, loader => loader.execute(state))
      .then(() => loaders)
  },

  terminate(loaders, state) {
    return Promise.map(loaders, loader => loader.terminate(state))
      .then(() => state)
  }
}
