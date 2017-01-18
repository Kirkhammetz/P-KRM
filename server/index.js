const path = require('path')
const ENV_PATH = process.env.NODE_ENV === 'production' ? path.resolve('.env') : path.resolve('.env.dev')

require('dotenv').config({ path:  ENV_PATH })
const secrets = require('./configs/secrets')

const { NODE_ENV } = process.env || 'dev'
const { SERVER_PORT } = secrets

process.title = secrets.SERVER_NAME

const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()

app.use(bodyParser())

const router = require('./router')(app)

app.listen(SERVER_PORT)

module.exports = app
