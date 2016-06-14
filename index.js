'use strict'

const Promise = require('bluebird')
    , path = require('path')
    , yaml = require('js-yaml')
    , R = require('ramda')

const fs = Promise.promisifyAll(require('fs-extra'))
    , glob = Promise.promisifyAll(require('glob'))

const gamux = require(path.join(__dirname, 'lib'))

module.exports = {
  run(state) {
  },

  update(state) {
  },

  diagnose(state) {
    gamux.loader.initialize(state)
      .then(ext => gamux.loader.execute(ext, state))
      .then(ext => gamux.loader.terminate(ext, state))
      .then(() => console.log('finish'))
  }
}
