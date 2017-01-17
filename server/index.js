const secrets = require('./configs/secrets')
const Koa = require('koa')
const app = new Koa()
const router = require('./router')(app)

module.exports = app
