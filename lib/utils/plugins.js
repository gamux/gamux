'use strict'

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , glob    = Promise.promisify(require('glob'))

// returns the basename
const basename = path.basename.bind(path)

// adds .exe to string when not running on a posix system
const bin = λ.curry((str, state) => state.platform.posix ? str : str + '.exe')

// returns the root folder
const root = λ.curry((plugin, state) => path.join(state.config.root,
                                                  plugin.matcher.location,
                                                  '..'))

// returns the content after the first dot
const afterdot = λ.pipe(basename,
                        λ.split('.'),
                        λ.tail,
                        λ.join('.'),
                        ext => '.' + ext)

// extless file
const extless = file => path.basename(file, path.extname(file))

// dotless file
const dotless = file => path.basename(file, afterdot(file))

// returns the game name
const name = λ.pipe(basename,
                    λ.split('.'),
                    λ.head,
                    λ.replace('_', ' '))

// executable path
const exec = λ.curry((state, file) =>
  path.join(root(state), binary(file, state)))

module.exports = {
  basename,
  bin,
  root,
  afterdot,
  extless,
  dotless,
  name,
  exec
}
