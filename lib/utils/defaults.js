'use strict'

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , glob    = Promise.promisify(require('glob'))

module.exports = {
  d_noopArr: λ.defaultTo(() => []),
  d_noopP:   λ.defaultTo(() => new Promise(resolve => resolve())),
  d_arrP:    λ.defaultTo(() => new Promise(resolve => resolve([]))),
  d_str:     λ.defaultTo(''),
  d_arr:     λ.defaultTo([]),
}
