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

/**
 * TODO: Error Logs
 * use ctx.app.emit to log errors and don't expose them to api response.
 */
app.on('error', (err) => {
  // ADD Logging Library
  if (process.env.NODE_ENV !== 'test') {
    console.error("Error to log:", err)
  }
})

module.exports = app
