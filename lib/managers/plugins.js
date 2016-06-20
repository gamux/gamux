'use strict'

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , glob    = Promise.promisify(require('glob'))

// defaults
const d_noopP    = λ.defaultTo(state => new Promise(resolve => resolve()))
    , d_arrP     = λ.defaultTo(state => new Promise(resolve => resolve([])))
    , d_str      = λ.defaultTo('')
    , d_arr      = λ.defaultTo([])
    , d_matcher  = λ.defaultTo({ search: [], ignore: [], location: 'invalid' })
    , d_noopArr  = λ.defaultTo(x => [])
    , d_platform = λ.defaultTo(() => 'PC')
    , d_location = λ.defaultTo('invalid')

// functions
const joinF = λ.curry((folder, arr) => λ.map(f => path.join(folder, f), arr))

module.exports = {

  //    ##                                 ##
  //   #  #                                 #
  //   #      ##   ###    ##   ###    ###   #
  //   # ##  # ##  #  #  # ##  #  #  #  #   #
  //   #  #  ##    #  #  ##    #     # ##   #
  //    ###   ##   #  #   ##   #      # #  ###

  // general plugin lister
  list(kind) {
    const patterns = {
      loaders: state =>
        Promise.reduce(state.path.plugins.loaders,
          (acc, folder) => glob('*.js', { cwd: folder })
            .then(f => acc.concat(joinF(folder, f))), []),

      deployers: state =>
        Promise.reduce(state.path.plugins.deployers,
          (acc, folder) => glob('*.js', { cwd: folder })
            .then(f => acc.concat(joinF(folder, f))), [])
    }

    return d_arrP(patterns[kind])
  },

  // general plugin loader
  load(kind, file) {
    // require file
    const plugin = require(file)

    // ensure version
    plugin.version = d_str(plugin.version)

    const patterns = {
      loaders: state => {
        plugin.matcher = d_matcher(plugin.matcher)
        plugin.matcher.search   = d_arr(plugin.matcher.search)
        plugin.matcher.ignore   = d_arr(plugin.matcher.ignore)
        plugin.matcher.location = d_location(plugin.matcher.location)


        plugin.analyze  = d_noopArr(plugin.analyze)
        plugin.platform = d_platform(plugin.platform)

        plugin.initialize = d_noopP(plugin.initialize)
        plugin.execute    = d_noopP(plugin.execute)
        plugin.terminate  = d_noopP(plugin.terminate)

        return plugin
      },

      deployers: state => {
        plugin.deploy = d_noopP(plugin.deploy)

        return plugin
      }
    }

    return patterns[kind]
  },

  //    ##                      #      #    #
  //   #  #                           # #
  //    #    ###    ##    ##   ##     #    ##     ##
  //     #   #  #  # ##  #      #    ###    #    #
  //   #  #  #  #  ##    #      #     #     #    #
  //    ##   ###    ##    ##   ###    #    ###    ##
  //         #

  // deploy a game using a deployer
  deploy(game, deployer, state) {
    return deployer.deploy(game, state)
      .then(() => game)
  },

  // search for games using a loader
  search(loader, state) {
    const folder = path.join(state.config.root, loader.matcher.location)

    const filter = λ.filter(x => λ.not(λ.any(test => test(x),
                    λ.map(x => λ.test(new RegExp(x)),
                          loader.matcher.ignore))))

    return Promise.map(loader.matcher.search, pattern => {
      return glob(pattern, {cwd: folder})
        .then(files => filter(files))
        .then(files => joinF(folder, files))
        .then(files => Promise.filter(
                         Promise.map(
                           files,
                           file => loader.analyze(file, state)),
                         game => !λ.isNil(game)))})
      .then(files => λ.flatten(files))
  },

  // analyze game
  analyze(bname, loader, state) {
    const file = path.join(state.config.root, loader.matcher.location, bname)

    const valid = λ.pipe(λ.map(str => new RegExp(str)),
                           λ.map(regexp => λ.test(regexp, file)),
                           λ.any(λ.identity),
                           λ.not)(loader.matcher.ignore)
    if (valid) {
      return loader.analyze(file, state)
    }
  },

  // initialize loader engine
  initialize(game, loader, state) {
    return new Promise((resolve) => resolve())
    /*const files = reduce(state.path.loaders, (acc, folder) => {
      const joinF = λ.map(f => path.join(folder, f))

      return glob('*.js', { cwd: folder })
        .then(f => acc.concat(joinF(f)))
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
    */
  },

  execute(game, loader, state) {
    return new Promise((resolve) => resolve())
  },

  terminate(game, loader, state) {
    return new Promise((resolve) => resolve())
  }
}
