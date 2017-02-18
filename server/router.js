const UserController = require('./controllers/user.controller')
const jwt = require('./middlewares/jwt.middleware')

module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  /**
   * Users
   */
  api.get('/users', UserController.index)
  api.post('/users', UserController.create)
  api.get('/users/:id')
  api.put('/users/:id')
  api.delete('/users/:id')

  api.post('/users/auth', UserController.auth)

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
