const path = require('path')
require('dotenv').config({ path: path.resolve('.env.test') })

const { expect } = require('chai')
const secrets = require('../configs/secrets')

// const app = require(path.resolve('./server'))
// app.listen(secrets.SERVER_PORT)

describe('test suite setup', () => {
  it('suite should work', () => {
    expect(1).to.equal(1)
  })
})
