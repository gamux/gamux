//   #  #                          ####                #
//   # #                           #
//   ##     ##    ###   ###        ###   #  #   ###   ##     ##   ###
//   ##    # ##  #  #  #  #        #     #  #  ##      #    #  #  #  #
//   # #   ##     ##   # ##        #     #  #    ##    #    #  #  #  #
//   #  #   ##   #      # #        #      ###  ###    ###    ##   #  #
//                ###

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , utils   = require('../../utils')
    , fs      = Promise.promisifyAll(require('fs-extra'))

// supported platforms
const platforms = {
  smd: 'Mega Drive',
  gen: 'Mega Drive',
  sms: 'Master System'
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
    search: ['*.smd.zip', '*.gen.zip', '*.sms.zip'],
    ignore: [],
    location: path.join('KegaFusion', 'roms')
  },

  // analyze game by file
  analyze(file, state) {
    const plat = platform(file)

    const image = {
      'Mega Drive': 'gen.png',
      'Master System': 'ms.png'
    }

    const game = {
      name: name(file),
      categories: [plat],
      image: path.join(__dirname, 'kega-fusion', image[plat]),
      cwd: root(plugin, state),
      command: [executable(plugin, 'Fusion', state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  }
}
