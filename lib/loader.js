'use strict'

const Promise = require('bluebird')
    , λ = require('ramda')
    , path = require('path')

const glob = Promise.promisify(require('glob'))

const promise  = λ.defaultTo(state => new Promise(resolve => resolve()))
    , matcher  = λ.defaultTo({ search: [], ignore: [] })
    , platform = λ.defaultTo(() => 'PC')
    , emptyStr = λ.defaultTo('')
    , emptyArr = λ.defaultTo([])
    , hskMerge = λ.curry((a, b) => λ.map(x => [x, b], a))

const applyFolder = λ.curry((folder, arr) =>
  λ.map(f => path.join(folder, f), arr))

function reduce(list, fn) {
  return Promise.reduce(list, fn, [])
}

module.exports = {

  // list game loaders
  list(state) {
    return reduce(state.path.loaders, (acc, folder) => {
      return glob('*.js', { cwd: folder })
        .then(f => acc.concat(applyFolder(folder, f)))
    })
  },

  // load game loader
  load(files, state) {
    return Promise.map(files, f => {
      const loader = require(f)

      loader.version = emptyStr(loader.version)

      loader.matcher = matcher(loader.matcher)
      loader.matcher.search = emptyArr(loader.matcher.search)
      loader.matcher.ignore = emptyArr(loader.matcher.ignore)

      loader.platform = platform(loader.platform).bind(loader)

      loader.initialize = promise(loader.initialize).bind(loader)
      loader.execute = promise(loader.execute).bind(loader)
      loader.terminate = promise(loader.terminate).bind(loader)

      return loader
    })
  },

  search(loaders, state) {
    return Promise.map(loaders, loader => {
      const folder = path.join(state.config.root, loader.location)

      const filter = λ.filter(x => λ.not(λ.any(test => test(x),
                      λ.map(x => λ.test(new RegExp(x)),
                            loader.matcher.ignore))))

      return Promise.map(loader.matcher.search, pattern => {
        return glob(pattern, {cwd: folder})
          .then(files => filter(files))
          .then(files => applyFolder(folder, files))
          .then(files => Promise.map(file => loader.analyze(file), files))
      })
    })
  },

  initialize(state) {
    /*const files = reduce(state.path.loaders, (acc, folder) => {
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
      .then(() => loaders)*/
    return new Promise((resolve) => resolve())
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
