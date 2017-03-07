const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views');
const statics = require('koa-static')
const path = require('path')



/**
 * Middlewares
 */
app.use(bodyParser({
  enableTypes: ['json']
}))

app.use(views(path.resolve(__dirname, 'views/'), {
  extension: 'pug',
  map: {
    pug: 'pug',
  },
}))

app.use(statics(path.resolve(__dirname, '../public/')))

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
