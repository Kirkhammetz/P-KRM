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

module.exports = app
