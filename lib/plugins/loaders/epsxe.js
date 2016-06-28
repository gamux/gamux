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
    const cwd = root(plugin, state)

    const bcard = λ.pipe(extless, λ.replace(/\s\-\s(Disc\s\d|CD \d|CD\d)$/g,
                                            ''))(file)
        , memcards = λ.map(num => path.join(cwd, 'memcards',
                                    λ.join('', [bcard, ' ', num, '.mcr']))
                          , ['MC1', 'MC2'])

    const game = {
      name: name(file),
      categories: ['Playstation'],
      image: path.join(__dirname, 'epsxe', 'ps.png'),
      command: [executable(plugin, 'ePSXe', state), '-analog',
                '-loadbin', file, '-slowboot', '-nogui',
                '-loadmemc0', memcards[0], '-loadmemc1', memcards[1]],
      backup: [save(file), smatcher(file)],
      cwd,
    }

    return new Promise(resolve => resolve(game))
  }
}
