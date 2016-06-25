'use strict'
//////////////////////////////////////////////////////////////////////////////
//    ##    #           #
//   #  #   #           #
//    #    ###    ###  ###    ##
//     #    #    #  #   #    # ##
//   #  #   #    # ##   #    ##
//    ##     ##   # #    ##   ##
//
////
//
// This is the shared and global state, it's a evil place full of monster >:)
// Jokes aside, this is a place that you access to get user configurations.
//

// dependencies, no bluebird since the function is not async
const λ    = require('ramda')
    , path = require('path')
    , fs   = require('fs-extra')
    , yaml = require('js-yaml')
    , glob = require('glob')
    , util = require('../utils')

// identity function that fallbacks to empty string
const d_str = util.defaults.d_str

// pure deep merge function
const deepMerge = util.general.deepMerge

// pure test to check if the string is the name of a posix system
const isWindows = λ.pipe(λ.match(/^win/), λ.isEmpty, λ.not)

// pure test to check if the value is not nil
const notNil = λ.pipe(λ.isNil, λ.not)

// pure function that returns the configs folder
const guessCfgsFolder = λ.ifElse(λ.identity,
  // is windows
  () => path.join(process.env.APPDATA, 'Gamux'),
  // is not windows
  () => path.join(process.env.HOME, '.gamux'))

// parses a string of yaml file names
const parseMapYAML = λ.map(
                      λ.pipe(
                        file => fs.readFileSync(file),
                        raw => yaml.safeLoad(raw)))

// try to copy file without overwriting, silent failures
const tryCopy = λ.tryCatch((f, t) => fs.copySync(f, t, { clobber: false }),
                           () => null)

module.exports =

function state() {
  /* platform independent information */

  // root install directory
  const root = path.join(__dirname, '..', '..')

  // package.json location, used to get gamux version
  const packageJSON = path.join(root, 'package.json')

  // platform independent initialization command
  const cmd = λ.join(' ', ['"' + process.argv[0] + '"',
                           '"' + path.join(root, 'bin', 'gamux') + '"'])

  /* platform discover */

  // platform name
  const platform = process.platform

  // purelly tests if the platform is a windows system
  const windows = isWindows(platform)

  /* platform dependent information */

  // builds a platform dependent command for initializing gamux
  const command = λ.ifElse(λ.identity,
    // is a windows system
    () => λ.join(' ', ['"' + path.join(root, 'bin', 'hidecmd.vbs') +
                       '"', cmd]),
    // is not a windows system
    () => cmd)(windows)

  /* general information */

  // default and user configuration folders
  const defCfgsFdr = path.join(root, 'lib', 'plugins')
      , usrCfgsFdr = guessCfgsFolder(windows)
      , cfgsFdrArr = [defCfgsFdr, usrCfgsFdr]

  // default and user config files
  const defCfgs = path.join(defCfgsFdr, 'gamux.yml')
      , usrCfgs = path.join(usrCfgsFdr, 'gamux.yml')
      , configs = [defCfgs, usrCfgs]

  // dependable plugin folders
  const loaders    = λ.map(fdr => path.join(fdr, 'loaders'), cfgsFdrArr)
      , deployers  = λ.map(fdr => path.join(fdr, 'deployers'), cfgsFdrArr)
      , extensions = λ.map(fdr => path.join(fdr, 'extensions'), cfgsFdrArr)
      , folders    = λ.reduce(λ.concat, [], [loaders,
                                             deployers,
                                             extensions])

  /* start of evil side effects and shit */

  // ensures the folder list exists
  λ.forEach(folder => fs.ensureDir(folder), folders)

  // try to copy default configs to user configs folder, without overwriting
  tryCopy(defCfgs, usrCfgs)

  // loads package json
  const pkg = require(packageJSON)

  // loads default and user configurations, then deep merges them
  const merged = λ.apply(deepMerge, parseMapYAML(configs))

  /* end of evil side effects and shit */

  // returns the state
  return {
    version: pkg.version,
    config: merged,
    platform: { name: platform, windows, command },
    paths: {
      install: root,
      user: usrCfgsFdr,
      plugins: { loaders, deployers, extensions }
    }
  }
}
