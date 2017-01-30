const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()

/**
 * Middlewares
 */
app.use(bodyParser({
  enableTypes: ['json', 'form']
}))

require('./router')(app)

/**
 * TODO: Error Logs
 * use ctx.app.emit to log errors and don't expose them to api response.
 */
app.on('error', (err) => {
  // ADD Logging Library
  console.error("Error to log:", err)
})

module.exports = app
