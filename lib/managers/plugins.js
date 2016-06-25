'use strict'

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , utils   = require('../utils')
    , glob    = Promise.promisify(require('glob'))

// defaults
const d_noopArr  = utils.defaults.d_noopArr
    , d_noopP    = utils.defaults.d_noopP
    , d_arrP     = utils.defaults.d_arrP
    , d_str      = utils.defaults.d_str
    , d_arr      = utils.defaults.d_arr
    , d_matcher  = λ.defaultTo({ search: [], ignore: [], location: 'invalid' })
    , d_platform = λ.defaultTo(() => 'PC')
    , d_location = λ.defaultTo('invalid')

// join folder
const joinF = λ.curry((folder, arr) => λ.map(f => path.join(folder, f), arr))

// adds metadata
const metadata = λ.curry((loader, file, obj) =>
  λ.pipe(
    λ.assoc('loader', loader.name),
    λ.assoc('filename', file))(obj))

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
        Promise.reduce(state.paths.plugins.loaders,
          (acc, folder) => glob('*.js', { cwd: folder })
            .then(f => acc.concat(joinF(folder, f))), []),

      deployers: state =>
        Promise.reduce(state.paths.plugins.deployers,
          (acc, folder) => glob('*.js', { cwd: folder })
            .then(f => acc.concat(joinF(folder, f))), [])
    }

    return d_arrP(patterns[kind])
  },

  // general plugin loader
  load(kind, file) {
    // require file
    const plugin = require(file)

    // plugin name
    plugin.name = path.basename(file, '.js')

    // ensure version
    plugin.version = d_str(plugin.version)

    const patterns = {
      loaders: state => {

        plugin.matcher          = d_matcher(plugin.matcher)
        plugin.matcher.search   = d_arr(plugin.matcher.search)
        plugin.matcher.ignore   = d_arr(plugin.matcher.ignore)
        plugin.matcher.location = d_location(plugin.matcher.location)
        plugin.analyze          = d_noopArr(plugin.analyze)
        plugin.platform         = d_platform(plugin.platform)
        plugin.initialize       = d_noopP(plugin.initialize)
        plugin.execute          = d_noopP(plugin.execute)
        plugin.terminate        = d_noopP(plugin.terminate)

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
  deploy(games, deployer, state) {
    return deployer.deploy(games, state)
      .then(() => games)
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
                           file => loader.analyze(file, state)
                            .then(game => metadata(loader, file, game))),
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
        .then(game => metadata(loader, file, game))
    }
  },

  // initialize loader engine
  initialize(game, loader, state) {
    return new Promise((resolve) => resolve())
    /*const files = reduce(state.paths.loaders, (acc, folder) => {
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
