'use strict'

const λ = require('ramda')

const includes = λ.pipe(λ.indexOf, i => i > -1)

module.exports = {
  includes
}
