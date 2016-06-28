'use strict'

const Promise = require('bluebird')
    , path    = require('path')
    , yaml    = require('js-yaml')
    , λ       = require('ramda')
    , spawn   = require('cross-spawn')
    , fs      = Promise.promisifyAll(require('fs-extra'))
    , glob    = Promise.promisifyAll(require('glob'))

const maybe = (a, b, c) => new Promise((res, rej) =>
  λ.isNil(a) ? rej(c) : res(λ.defaultTo(a, b)))

const _ = undefined

const plugins = require('./plugins')

const actions = module.exports = {

  play(loader, file, state) {
    return plugins.list('loaders')(state)
      .then(files => Promise.filter(λ.reverse(files),
        f => loader === path.basename(f, '.js')))
      .then(arr => maybe(arr[0], _, '(loader not found)'))
      .then(f => plugins.load('loaders', f)(state))
      .then(loader => plugins.analyze(file, loader, state)
        .then(game => maybe(game, { loader, game }, '(invalid game)')))
      .then(obj => plugins.initialize(obj.game, obj.loader, state)
        .then(() => obj))
      .then(obj => {
        try {
          const cmd  = λ.head(obj.game.command)
          const args = (obj.game.command.length > 1) ? λ.tail(obj.game.command)
                                                     : []

          const child = spawn(cmd, args, { stdio: 'inherit',
                                           cwd: obj.game.cwd })

          // supposedly successful spawn
          return { game: obj.game, loader: obj.loader, child }
        } catch (e) {
          // supposedly invalid spawn
          return { game: obj.game, loader: obj.loader }
        }
      })
      .then(obj => maybe(obj.child, obj, '(invalid command)'))
      .then(obj => plugins.execute(obj.game, obj.loader, state)
        .then(() => obj))
      .then(obj => new Promise((resolve, reject) => {
        let closed = false

        obj.child.on('exit', () => {
          if (!closed) {
            closed = true
            resolve(obj)
          }
        })

        obj.child.on('error', () => {
          if (!closed) {
            closed = true
            resolve(obj)
          }
        })
      }))
      .then(obj => plugins.terminate(obj.game, obj.loader, state)
        .then(() => obj))
  },

  deploy(state) {
    return plugins.list('deployers')(state)
      .then(files => Promise.map(files,
        file => plugins.load('deployers', file)(state)))
      .then(deployers => actions.search(state)
        .then(games => Promise.map(deployers,
          deployer => plugins.deploy(games, deployer, state))))
      .then(deployed => λ.flatten(deployed))
  },

  search(state) {
    return plugins.list('loaders')(state)
      .then(files => Promise.map(files,
        file => plugins.load('loaders', file)(state)))
      .then(loaders => Promise.map(loaders,
        loader => plugins.search(loader, state)))
      .then(games => λ.flatten(games))
  }
}
