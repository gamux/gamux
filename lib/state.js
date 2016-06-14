'use strict'

const λ = require('ramda')
    , path = require('path')
    , fs = require('fs-extra')
    , yaml = require('js-yaml')
    , glob = require('glob')

const isPosix = λ.pipe(λ.match(/^win/), λ.isEmpty)

const guessRoot = λ.ifElse(isPosix,
                    () => path.join(process.env.HOME, '.gamux'),
                    () => path.join(process.env.APPDATA, 'Gamux'))

const notNil = λ.pipe(λ.isNil, λ.not)

const orEmptyStr = λ.defaultTo('')

const mergeConf = λ.pipe(
                    λ.map(
                      λ.pipe(
                        file => fs.readFileSync(file),
                        raw => yaml.safeLoad(raw))),
                    λ.apply(
                      λ.mergeWithKey(
                        λ.unapply(
                          λ.ifElse(λ.pipe(λ.head, λ.equals('steam')),
                            λ.pipe(λ.tail, λ.apply(λ.merge)),
                            λ.last)))))

module.exports =
function state(uid) {

  // execution mode information
  const execute = notNil(uid)
      , game    = orEmptyStr(uid)

  // platform information
  const platform = process.platform
      , posix    = isPosix(platform)

  // directories
  const root = path.join(__dirname, '..')
      , user = guessRoot(platform)
      , cache = path.join(user, 'cache')

  const loaders = [ path.join(root, 'loaders'),
                    path.join(user, 'loaders') ]

  const plugins = [ path.join(root, 'plugins'),
                    path.join(user, 'plugins') ]


  // file diretories
  const defaults = path.join(__dirname, '..', 'gamux.yaml')
  const configs = path.join(user, 'gamux.yaml')

  // since this function is not pure, let's shit it all over the place
  fs.ensureDir(user)
  fs.ensureDir(cache)
  fs.ensureDir(loaders[1])
  fs.ensureDir(plugins[1])

  // and shit a little more
  λ.tryCatch(
    (f, t) => fs.copySync(f, t, { clobber: false }),
    () => null)(defaults, configs)

  // merged config
  const config = mergeConf([defaults, configs])

  // game list, empty when running games
  const games = λ.ifElse(λ.identity,
    () => glob.sync('*.json', { cwd: cache }),
    () => [])

  return {
    mode: {
      execute,
      game
    },

    platform: {
      name: platform,
      posix
    },

    path: {
      root,
      user,
      cache,
      loaders,
      plugins
    },

    games,

    config
  }
}
