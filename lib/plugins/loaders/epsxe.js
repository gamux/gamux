//         ###    ##   #  #
//         #  #  #  #  #  #
//    ##   #  #   #     ##    ##
//   # ##  ###     #    ##   # ##
//   ##    #     #  #  #  #  ##
//    ##   #      ##   #  #   ##
//

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , utils   = require('../../utils')
    , fs      = Promise.promisifyAll(require('fs-extra'))

// imported functions
const root       = utils.plugins.root
    , bin        = utils.plugins.bin
    , name       = utils.plugins.name
    , extless    = utils.plugins.extless
    , dotless    = utils.plugins.dotless
    , executable = utils.plugins.executable

// TODO: correct saves and states

// returns save filename
const save = file => file

// returns a save state matcher
const smatcher = file => file

//   ###   ##                 #
//   #  #   #
//   #  #   #    #  #   ###  ##    ###
//   ###    #    #  #  #  #   #    #  #
//   #      #    #  #   ##    #    #  #
//   #     ###    ###  #     ###   #  #
//                      ###

const plugin = module.exports = {
  version: '1.0.0',

  // matcher data
  matcher: {
    search: ['*.img', '*.bin','*.iso'],
    ignore: [],
    location: path.join('ePSXe', 'isos')
  },

  // analyze game by file
  analyze(file, state) {
    const game = {
      name: name(file),
      categories: ['Playstation'],
      image: path.join(__dirname, 'epsxe', 'ps.png'),
      cwd: root(plugin, state),
      command: [executable(plugin, 'ePSXe', state), '-analog',
                '-loadbin', file, '-slowboot', '-nogui'],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
