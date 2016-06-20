//   #  #        ###          ##
//   #  #        #  #        #  #
//   #  #        ###         #  #
//   #  #        #  #        ####
//    ##    ##   #  #   ##   #  #
//    ##    ##   ###    ##   #  #

const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , fs      = Promise.promisifyAll(require('fs-extra'))

// supported platforms
const platforms = {
  gba: 'Game Boy Advance',
  gbc: 'Game Boy Color',
  gb: 'Game Boy',
}

// fallback functions
const d_image = λ.defaultTo('')
    , d_arr = λ.defaultTo([])

// binary name
const binary = λ.ifElse(state => state.platform.posix,
                        posix => 'VisualBoyAdvance-M',
                        win32 => 'VisualBoyAdvance-M.exe')

// executable path
const executable = state => path.join(root(state), binary(state))

// root path
const root = state => path.join(state.config.root,
                                plugin.matcher.location,
                                '..')

// whole file extension
const extname = λ.pipe(path.basename.bind(path),
                       λ.split('.'),
                       λ.tail,
                       λ.join('.'),
                       ext => '.' + ext)
// sanitized file name
const filename = λ.pipe(path.basename.bind(path),
                        λ.split('.'),
                        λ.head,
                        λ.replace('_', ' '))

// discover game platform
const platform = file => platforms[λ.head(
                                    λ.tail(
                                      λ.split('.', extname(file))))]

// discover save name
const save = λ.pipe(file => path.basename(file, path.extname(file)),
                    name => [name, '.sav'],
                    λ.join(''))

// build save state matcher
const smatcher = λ.pipe(file => path.basename(file, extname(file)),
                        name => [name, '*.sgm'],
                        λ.join(''))


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
      name: filename(file),
      platform: platform(file),
      image: '',
      location: root(state),
      command: [executable(state), file],
      backup: [save(file), smatcher(file)]
    }

    return new Promise(resolve => resolve(game))
  },
}
