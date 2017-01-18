const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()

app.use(bodyParser())

const router = require('./router')(app)

module.exports = app
