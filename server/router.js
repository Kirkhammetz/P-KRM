const UserController = require('./controllers/user.controller')
const jwt = require('./libs/jwt')
const Boom = require('boom')

module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  /**
   * Users
   */

  api.get('/users', jwt.auth, UserController.index)
  api.post('/users', UserController.create)
  api.get('/users/:id', jwt.auth, UserController.get)
  api.put('/users/:id')
  api.delete('/users/:id', jwt.auth, UserController.delete)

  api.post('/auth', UserController.auth)

  return app
    .use(async (ctx, next) => {
			/**
				* Wrapper
				*/
			ctx.response.body = {}
      /**
      * Catch error donwstream
      */
      try {
				ctx.response.status = 200 // assume 200, change in controllers accordingly
        await next()
      } catch (e) {
        // If there is a Boom error instance use is data or throw generic error
				if (e.status === 401) {
					ctx.status = 401
					return ctx.body = Boom.unauthorized('Invalid Auth Token').output.payload
				}
        if (e.output) {
          ctx.status = e.output.statusCode
          return ctx.body = e.output.payload
        }
        return ctx.body = {
          statusCode: 500,
          message: e.message || 'Internal Server Error.'
        }
      }
    })
    .use(api.routes())
    .use(api.allowedMethods())
}
