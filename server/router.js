const UserController = require('./controllers/user.controller')
const AuthController = require('./controllers/auth.controller')
const jwt = require('./libs/jwt')
const Boom = require('boom')
const Router = require('koa-router')

module.exports = (app) => {
  const public = new Router()
  const api = new Router({ prefix: '/api' })

  /**
   * Public Routes
   */
  public.get('/', async (ctx, next) => {
    await ctx.render('index.pug')
  })

  /**
   * API ROUTER
   */

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

  api.post('/auth', AuthController.auth)

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
    .use(public.routes())
    .use(api.routes())
    .use(api.allowedMethods())
}
