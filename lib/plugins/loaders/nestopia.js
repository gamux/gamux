//   ###          ##               #  #  ####
//   #  #        #  #              ####  #
//   #  #   ##    #    # #   #  #  ####  ###
//   #  #  # ##    #   ####  #  #  #  #  #
//   #  #  ##    #  #  #  #  #  #  #  #  #
//   ###    ##    ##   #  #   ###  #  #  ####

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
const save = file => dotless(file) + '.sav'

// returns a save state matcher
const smatcher = file => dotless(file) + '.ns[0-9]'

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
    search: ['*.nes.7z'],
    ignore: [],
    location: path.join('Nestopia', 'roms')
  },

  // analyze game by file
  analyze(file, state) {
    const game = {
      name: name(file),
      categories: ['Nintendo'],
      image: path.join(__dirname, 'nestopia', 'nds.png'),
      cwd: root(plugin, state),
      command: [executable(plugin, 'nestopia', state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
