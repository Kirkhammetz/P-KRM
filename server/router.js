module.exports = (app) => {
  const api = require('koa-router')()

  api.get('/', async (ctx, next) => {
    ctx.body = 'Wellcome route'
  })

  return app
    .use(api.routes())
    .use(api.allowedMethods())
}
