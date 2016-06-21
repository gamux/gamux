'use strict'

const λ = require('ramda')

const includes = λ.pipe(λ.indexOf, i => i > -1)

const wrap = λ.curry((w, str) => w + str + w)

module.exports = {
  includes,
  wrap
}
