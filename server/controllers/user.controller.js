const User = require('../models/user.model')
const Boom = require('boom')

module.exports = {
  index: async ctx => {
    let user
    try {
      users = await User.findAll({
				attributes: { exclude: ['password'] },
				raw: true,
			})
    } catch (e) {
      ctx.app.emit('error', e)
      throw Boom.internal()
    }
    return ctx.body.users = users
  },

  create: async ctx => {
    const { username, password, email } = ctx.request.body

    if (!username) throw Boom.badRequest('Username not provided')
    if (!password) throw Boom.badRequest('Password not provided')
    if (!email) throw Boom.badRequest('Email not provided')

    let user
    try {
      user = await User.create({ username, password, email })
    } catch (e) {
      ctx.app.emit('error', e)
      throw Boom.badRequest(e.message)
    }
    return ctx.body.user = user
	},

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

	get: async ctx => {
		const { id } = ctx.params
		if(!id) throw Boom.invalid('No id provided')

		/**
		  * Get User
			*/
		let user
		try {
			user = await User.findOne({
				attributes: { exclude: ['password'] },
				where: { id },
				raw: true
			})
		} catch(e) {
			ctx.app.emit('error', e)
			throw Boom.internal('Error fetching single user')
		}
		if (!user) throw Boom.notFound('User not found')
		return ctx.body.user = user
	},

	delete: async ctx => {
		const { id } = ctx.params
		if(!id) throw Boom.invalid('No id provided')
		/**
		  * Get User
			*/
		user = await User.findOne({
			where: { id },
		})
		if (!user) throw Boom.notFound('User not found')
		let success
		try {
			await user.destroy()
		} catch(e) {
			ctx.app.emit('error', e)
			ctx.body.success = false
			throw Boom.internal('Error deleting  user')
		}
		return ctx.body.success = true
	},

}
