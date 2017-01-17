const path = require('path')
const ENV_PATH = process.env.NODE_ENV === 'production' ? './.env' : './.env.dev'
require('dotenv').config({ path: path.resolve(ENV_PATH) })

const { NODE_ENV } = process.env || 'dev'
const { PORT } = process.env

const app = require('./server')

app.listen(PORT)
