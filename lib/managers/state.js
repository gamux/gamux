'use strict'

const λ    = require('ramda')
    , path = require('path')
    , fs   = require('fs-extra')
    , yaml = require('js-yaml')
    , glob = require('glob')

const isPosix    = λ.pipe(λ.match(/^win/), λ.isEmpty)
    , notNil     = λ.pipe(λ.isNil, λ.not)
    , orEmptyStr = λ.defaultTo('')

const guessRoot = λ.ifElse(isPosix,
  () => path.join(process.env.HOME, '.gamux'),
  () => path.join(process.env.APPDATA, 'Gamux'))


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
  // root directory
  const root = path.join(__dirname, '..', '..')

  // package location
  const pkg = require(path.join(root, 'package.json'))

  // execution mode information
  const execute = notNil(uid)
      , game    = orEmptyStr(uid)

  // platform information
  const platform    = process.platform
      , posix       = isPosix(platform)
      , rawcmd  = λ.join(' ', [
        '"' + process.argv[0] + '"',
        '"' + path.join(root, 'bin', 'gamux') + '"'
      ])
      , command = (posix ? rawcmd
                         : λ.join(' ',
                          ['"' + path.join(root, 'hidecmd.vbs') + '"',
                           rawcmd]))

  // platform specific and overridable directories
  const user      = guessRoot(platform)
      , plugins   = path.join(root, 'lib', 'plugins')
      , loaders   = [
        path.join(plugins, 'loaders'),
        path.join(user, 'plugins', 'loaders')
      ]
      , deployers = [
        path.join(plugins, 'deployers'),
        path.join(user, 'plugins', 'deployers')
      ]
      , defaults  = path.join(plugins, 'gamux.yaml')
      , configs   = path.join(user, 'gamux.yaml')

  // since this function is not pure, let's shit it all over the place
  fs.ensureDir(user)
  fs.ensureDir(loaders[1])
  fs.ensureDir(deployers[1])

  // and shit a little more
  λ.tryCatch(
    (f, t) => fs.copySync(f, t, { clobber: false }),
    () => null)(defaults, configs)

  // merged config
  const config = mergeConf([defaults, configs])

  return {
    version: pkg.version,

    command,

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
      plugins: {
        loaders,
        deployers
      }
    },

    config
  }
}
