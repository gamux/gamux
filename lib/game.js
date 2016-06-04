'use strict'

const state = require('./state')
    , path = require('path')

module.exports = Game

function Game(uid) {
  // uid is used to cache the game * required
  this.uid = uid

  // name is the steam displayed game name
  this.name = ''

  // image is a image for representing the game
  this.image = ''

  // command is the command that starts the game
  this.command = ''
}

Game.prototype = {
  path() {
    return path.join(state.cache, this.uid + '.json')
  },

  toJSON() {
    return JSON.stringify({
      uid: this.uid,
      name: this.name,
      image: this.image,
      command: this.command
    })
  }
}
