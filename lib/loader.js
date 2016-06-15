'use strict'

const Promise = require('bluebird')
    , λ = require('ramda')
    , path = require('path')

const glob = Promise.promisify(require('glob'))

const applyFolder = λ.curry((folder, arr) =>
  λ.map(f => path.join(folder, f), arr))

const orNoopPromise = λ.defaultTo(state => new Promise(resolve => resolve()))
    , orNoopPC      = λ.defaultTo(() => 'PC')
    , orNoopArray   = λ.defaultTo(x => [])
    , orMatcher     = λ.defaultTo({ search: [], ignore: [] })
    , orString      = λ.defaultTo('')
    , orArray       = λ.defaultTo([])

module.exports = {

  // [!] list game loaders
  list(state) {
    return Promise.reduce(state.path.loaders,
      (acc, folder) => glob('*.js', { cwd: folder })
        .then(f => acc.concat(applyFolder(folder, f))), [])
  },

  // [!] loads a loader plugin
  load(files, state) {
    return Promise.map(files, f => {
      // require loader
      const loader = require(f)

      // ensure version
      loader.version = orString(loader.version)

      // ensure matcher object
      loader.matcher = orMatcher(loader.matcher)

      // ensure search and ignore arrays
      loader.matcher.search = orArray(loader.matcher.search)
      loader.matcher.ignore = orArray(loader.matcher.ignore)

      // ensure analyse procedure
      loader.analyze = orNoopArray(loader.analyze)

      // ensure platform
      loader.platform = orNoopPC(loader.platform).bind(loader)

      // ensure procedures
      loader.initialize = orNoopPromise(loader.initialize).bind(loader)
      loader.execute    = orNoopPromise(loader.execute).bind(loader)
      loader.terminate  = orNoopPromise(loader.terminate).bind(loader)

      // return safe loader
      return loader
    })
  },

  // [!] builds a game list to cache later
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
