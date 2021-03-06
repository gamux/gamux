//   #  #        ###          ##
//   #  #        #  #        #  #
//   #  #        ###         #  #
//   #  #        #  #        ####
//    ##    ##   #  #   ##   #  #
//    ##    ##   ###    ##   #  #

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , utils   = require('../../utils')
    , fs      = Promise.promisifyAll(require('fs-extra'))

// supported platforms
const platforms = {
  gba: 'Game Boy Advance',
  gbc: 'Game Boy Color',
  gb: 'Game Boy',
}

// fallback functions
const d_image = utils.defaults.d_arr
    , d_arr   = utils.defaults.d_str

// imported functions
const root       = utils.plugins.root
    , name       = utils.plugins.name
    , afterdot   = utils.plugins.afterdot
    , extless    = utils.plugins.extless
    , dotless    = utils.plugins.dotless
    , executable = utils.plugins.executable

// returns the platform the game belongs
const platform = file =>
  platforms[λ.head(λ.tail(λ.split('.', afterdot(file))))]

// TODO: correct saves and states

// returns save filename
const save = file => extless(file) + '.sav'

// returns a save state matcher
const smatcher = file => dotless(file) + '*.sgm'

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
    search: ['*.gb.7z', '*.gbc.7z', '*.gba.7z'],
    ignore: [],
    location: path.join('VBA', 'roms')
  },

  // analyze game by file
  analyze(file, state) {
    const game = {
      name: name(file),
      categories: [platform(file)],
      image: path.join(__dirname, 'vba', 'gba.png'),
      cwd: root(plugin, state),
      command: [executable(plugin, 'VisualBoyAdvance-M', state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
