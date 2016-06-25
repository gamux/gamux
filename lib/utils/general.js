'use strict'

const λ = require('ramda')

const includes = λ.pipe(λ.indexOf, i => i > -1)

const wrap = λ.curry((w, str) => w + str + w)

// deeply copies b into a new object while fallbacking to A,
// arrays are not deeply copied
const deepMerge = λ.curry((a, b) => {
  const def = λ.defaultTo({})

  a = def(a)
  b = def(b)

  const output = {}

  Object.keys(a).forEach(k => {
    const item = a[k]

    if (λ.not(λ.isNil(item))) {
      if (λ.not(Array.isArray(item)) && (typeof item === 'object')) {
        output[k] = deepMerge({}, item)
      } else {
        output[k] = item
      }
    }
  })

  Object.keys(b).forEach(k => {
    const item = b[k]

    if (λ.not(λ.isNil(item))) {
      if (λ.not(Array.isArray(item)) && (typeof item === 'object')) {
        output[k] = deepMerge(a[k], item)
      } else {
        output[k] = item
      }
    }
  })

  return output
})


module.exports = {
  includes,
  wrap,
  deepMerge
}
