const UserController = require('./controllers/user.controller')

module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  api.get('/user', UserController.index)
  api.post('/user', UserController.create)

  return app
    .use(api.routes())
    .use(api.allowedMethods())
}
