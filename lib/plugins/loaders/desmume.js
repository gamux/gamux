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
    , executable = utils.plugins.executable

// TODO: correct saves and states

// returns save filename
const save = file => extless(file) + '.dsv'

// returns a save state matcher
const smatcher = file => extless(file) + '.ds[0-9]'

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
    search: ['*.nds.7z'],
    ignore: [],
    location: path.join('DeSmuME', 'Roms')
  },

  // analyze game by file
  analyze(file, state) {
    const game = {
      name: name(file),
      categories: ['Nintendo DS'],
      image: path.join(__dirname, 'desmume', 'nds.png'),
      cwd: root(plugin, state),
      command: [executable(plugin, 'DeSmuME', state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
