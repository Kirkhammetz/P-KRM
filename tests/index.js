const path = require('path')
require('dotenv').config({ path: path.resolve('.env.test') })
const { expect } = require('chai')

global.PATHS = {
  tests: path.resolve(__dirname),
  server: path.resolve(__dirname, '../server'),
  app: path.resolve(__dirname, '../main.js'),
  getServerNode: (node) => {
    return path.resolve(path.resolve(__dirname, '../server'), node)
  }
}

// const app = require(path.resolve('./server'))
// app.listen(secrets.SERVER_PORT)

describe('test suite setup', () => {
  it('suite should work', () => {
    expect(1).to.equal(1)
  })
})

/**
 * SUITES
 */
require('./users/model.test')
require('./users/api.test')
