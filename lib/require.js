const path = require('path')
    , oldRequire = global.require

global.require = function require(str) {
  if (str == 'gamux') {
    oldRequire(path.join(__dirname, 'index.js'))
  } else {
    oldRequire(str)
  }
}
