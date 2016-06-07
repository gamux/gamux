'use strict'

const Promise = require('bluebird')
    , fs = Promise.promisifyAll(require('fs-extra'))
    , path = require('path')
    , R = require('ramda')
    , U = require('./util')
    , yaml = require('js-yaml')

const State = init()

module.exports = State

function init() {
  const filename = path.join(__dirname, '..', 'gamux.yaml')
      , raw = fs.readFileSync(filename)
      , obj = yaml.safeLoad(raw)

  obj.platform = process.platform
  obj.posix    = !(/^win/.test(obj.platform))

  obj.root = obj.posix ? path.join(process.env.HOME, '.gamux')
                       : path.join(process.env.APPDATA, 'Gamux')

  obj.config   = path.join(obj.root, 'gamux.yaml')
  obj.cache    = path.join(obj.root, 'cache')
  obj.defaults = filename
  obj.load     = load
  obj.games    = []
  obj.game     = ''

  return obj
}

function update(obj) {
  R.forEach(
    R.ifElse(R.equals('steam'),

      // if
      key => R.forEach(key =>
        State.steam[key] = U.fback(obj.steam[key],
                                   State.steam[key]), obj[key]),

      // else
      key => State[key] = U.fback(obj[key], State[key])))
}

function load() {
  return fs.readFileAsync(State.config, 'utf8')
    .then(data => yaml.load(data, { filename: State.config }))
    .then(obj => update(obj))
    .then(() => State)
}
