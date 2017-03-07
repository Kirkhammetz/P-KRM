/**
 * Promisify APIs
 */
global.Promise = require('bluebird')
global.Promise.promisifyAll(require('bcrypt'))
global.Promise.promisifyAll(require('fs'))

/**
 * Get Enviromental Variables
 * @type {[type]}
 */
const path = require('path')
const ENV_PATH = process.env.NODE_ENV === 'production' ? path.resolve('.env') : path.resolve('.env.dev')
require('dotenv').config({ path:  ENV_PATH })
const secrets = require('./server/configs/secrets')

const { NODE_ENV } = process.env || 'dev'
const { SERVER_PORT } = secrets

/**
 * SET PROCESS TITLE
 */
process.title = secrets.SERVER_NAME

/**
 * START KOA
 */
const app = require('./server')

const logger = require('./server/libs/logger').init(app)

/**
 * Export App for Tests
 */
if (NODE_ENV === 'test') {
  module.exports = app.listen(SERVER_PORT)
} else {
  console.log(`Server up on: ${SERVER_PORT}`)
  app.listen(SERVER_PORT)
}
