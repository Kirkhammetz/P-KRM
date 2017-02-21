const UserController = require('./controllers/user.controller')
const jwt = require('./middlewares/jwt.middleware')
const Boom = require('boom')

module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  /**
   * Users
   */

  api.get('/users', jwt, UserController.index)
  api.post('/users', UserController.create)
  api.get('/users/:id', jwt,  UserController.get)
  api.put('/users/:id')
  api.delete('/users/:id')

  api.post('/auth', UserController.auth)

	api.get('*', async ctx => {
		ctx.status = 404
		ctx.body = Boom.notFound('Endpoint not found').output.payload	
	})

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
				ctx.response.body.statusCode = 200 // assume 200 and change in controllers
        await next()
      } catch (e) {
        // If there is a Boom error instance use is data or throw generic error
				if (e.status === 401) {
					ctx.status = e.status || 401
					return ctx.body = Boom.unauthorized('No auth token or invalid one provided').output.payload
				}
        if (e.output) {
          ctx.status = e.output.statusCode
          return ctx.body = e.output.payload
        }
				ctx.app.emit('error', e)
        return ctx.body = {
          statusCode: 500,
          message: 'Internal Server Error.'
        }
      }
    })
    .use(api.routes())
    .use(api.allowedMethods())
}
