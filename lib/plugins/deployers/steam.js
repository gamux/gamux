const Promise = require('bluebird')
    , λ       = require('ramda')
    , path    = require('path')
    , Steam   = require('node-steam-shortcuts')
    , utils   = require('../../utils')
    , fs      = Promise.promisifyAll(require('fs-extra'))


const includes = utils.general.includes
    , wrap = utils.general.wrap

const d_tags = λ.curry((game, favs) =>
  includes(game.name, favs) ? ['favorite'] : [])

const favorites = λ.pipe(
  λ.filter(game => includes('favorite', game.tags)),
  λ.map(game => game.appname)
)

module.exports = {
  version: '1.0.0',

  deploy(games, state) {
    const file = path.join(state.config.steam[state.platform.name],
                           state.config.id.toString(), 'config',
                           'shortcuts.vdf')

    return fs.readFileAsync(file, 'utf-8')
      .then(data => Steam.Parser.parse(data).toJSON())
      .then(oldGames => favorites(oldGames))
      .then(favs => {
        const formatted = λ.map(game => ({
          appname: game.name,
          icon: game.image,
          exe: λ.join(' ', [
            state.command,
            '--play',
            wrap('"', λ.join(':', [game.loader, path.basename(game.filename)]))
          ]),
          StartDir: game.cwd,
          tags: λ.concat(d_tags(game, favs), game.categories)
        }), games)

        return Steam.Builder.build(formatted)
      })
      .then(raw => fs.writeFileAsync(file, raw))

  }
}
