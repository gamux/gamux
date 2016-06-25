//    ##                       ##   #  #
//   #  #                     #  #  #  #
//    #    ###    ##    ###   #  #   ##
//     #   #  #  # ##  ##      ###   ##
//   #  #  #  #  ##      ##      #  #  #
//    ##   #  #   ##   ###     ##   #  #

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
    , executable = utils.plugins.executable

// TODO: correct saves and states

// returns save filename
const save = file => extless(file) + '.srm'

// returns a save state matcher
const smatcher = file => extless(file) + '.[0-9][0-9][0-9]'

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
    search: ['*.smc.zip'],
    ignore: [],
    location: path.join('Snes9x', 'roms')
  },

  // analyze game by file
  analyze(file, state) {
    const game = {
      name: name(file),
      categories: ['Super Nintendo'],
      image: path.join(__dirname, 'snes9x', 'snes.png'),
      cwd: root(plugin, state),
      command: [executable(plugin, 'VisualBoyAdvance-M', state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
