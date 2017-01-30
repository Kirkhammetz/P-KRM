const path = require('path')
const ENV_PATH = process.env.NODE_ENV === 'production' ? path.resolve('.env') : path.resolve('.env.dev')

require('dotenv').config({ path:  ENV_PATH })
const secrets = require('./server/configs/secrets')

const { NODE_ENV } = process.env || 'dev'
const { SERVER_PORT } = secrets

process.title = secrets.SERVER_NAME

const app = require('./server')

if (NODE_ENV === 'test') {
  module.exports = app.listen(SERVER_PORT)
} else {
  console.log(`Server up on: ${SERVER_PORT}`)
  app.listen(SERVER_PORT)
}
