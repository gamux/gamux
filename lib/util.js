'use strict'

const R = require('ramda')

module.exports = {
  fback
}

function fback(a, b) {
  if (R.isNil(a)) {
    return a
  } else if (R.isNil(b)) {
    return b
  }
}
