const User = require('../models/user.model')
const Boom = require('boom')

module.exports = {

  auth: async ctx => {
    const { password, email } = ctx.request.body

    if (!email || !email.length) throw Boom.badRequest('No Email Provided')
    if (!password || !password.length) throw Boom.badRequest('No Password Provided')

    /**
     * Check if user exist
     */
    let user
    try {
      user = await User.findOne({ where: { email } })
    } catch (e) {
      // Catch Sequelize Error if any.
      ctx.app.emit('error', e)
      throw Boom.internal()
    }

		// throw if not found
    if (!user) throw Boom.notFound('User not found')

    /**
     * Check Password
     */
    let passwordCheck
    try {
      passwordCheck = await user.comparePassword(password)
    } catch (e) {
      // Catch bcrypt errors if any.
      ctx.app.emit('error', e)
      throw Boom.internal()
    }
    /**
     * Login or Reject
     */
    if (!passwordCheck) throw Boom.forbidden('Invalid password.')

    try {
      return ctx.body.authToken = user.auth()
    } catch (e) {
      // Catch auth errors if any.
      ctx.app.emit('error', e)
      throw Boom.internal()
    }
  },

	refresh: async ctx => {},
}
