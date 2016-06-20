const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , Steam   = require('node-steam-shortcuts')
    , fs      = Promise.promisifyAll(require('fs-extra'))

module.exports = {
  version: '1.0.0',

  deploy(game, state) {
    const file = path.join(state.config.steam[state.platform.name],
                           state.config.id.toString(), 'config',
                           'shortcuts.vdf')

    return fs.readFileAsync(file, 'utf-8')
      .then(data => Steam.Parser.parse(data))
      .then(obj => console.log(obj.toJson()))
  }
}
