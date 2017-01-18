const User = require('../models/user.model')
const Boom = require('boom')

module.exports = {
  index: async (ctx, next) => {
    console.log(User)
    let user
    try {
      users = await User.findAll()
    } catch (e) {
      const err = Boom.badRequest(e.message).output.payload
      ctx.status = err.statusCode
      return ctx.body = err
    }
    ctx.body = users
  },

  create: async (ctx, next) => {
    const { username, password, email } = ctx.request.body
    try {
      var newUser = await User.create({ username, password, email })
    } catch (e) {
      const err = Boom.badRequest(e.message).output.payload
      ctx.status = err.statusCode
      return ctx.body = err
    }
    return ctx.body = newUser
  }

}
