const UserController = require('./controllers/user.controller')
const jwt = require('./middlewares/jwt.middleware')

module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  api.get('/users', jwt, UserController.index)

  api.post('/users/auth', UserController.auth)
  api.post('/users/register', UserController.create)

  return app
    .use(async (ctx, next) => {
      /**
      * Catch error donwstream
      */
      try {
        await next()
      } catch (e) {
        if (e.output) return ctx.body = e.output.payload
        return ctx.body = {
          statusCode: 500,
          message: e.message || 'Internal Server Error.'
        }
      }
    })
    .use(api.routes())
    .use(api.allowedMethods())
}
