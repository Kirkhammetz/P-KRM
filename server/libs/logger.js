const secrets = require('../configs/secrets')
const path = require('path')
const fs = require('fs')

module.exports = {
  init: function(app) {
    app.on('error', this.append)
  },

  append: async function (error) {
    const self = this
    const LOG_FOLDER = path.resolve(__dirname, '../../logs')
    const FILENAME = secrets.NODE_ENV === 'test' ? 'errors.test.log' : 'errors.log'
    try {
      await fs.statAsync(LOG_FOLDER)
    } catch (e) {
      // if error is thrown is ENOENT
      await fs.mkdirAsync(LOG_FOLDER)
    }
    try {
      if (secrets.NODE_ENV === 'test') await fs.writeFileAsync(path.resolve(LOG_FOLDER, FILENAME), '')
      await fs.appendFileAsync(path.resolve(LOG_FOLDER, FILENAME), `${Date()}\t${JSON.stringify(error)}\n`, (err) => {})
    } catch (e) {
      console.error('Logger error:', e)
    }
    return true
  },
}
