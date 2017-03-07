const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()

/**
 * Middlewares
 */
app.use(bodyParser({
  enableTypes: ['json']
}))

require('./router')(app)

module.exports = app
