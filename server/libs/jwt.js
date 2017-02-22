const secrets = require('../configs/secrets')
const jwt = require('jsonwebtoken')
const KoaJwt = require('koa-jwt')
const Boom = require('boom')

const JwtHandlers = {
  sign: (payload) => {
    if (!payload) throw new Error('No payload provided to jwt sign method')
    return jwt.sign(payload, secrets.SERVER_SECRET_KEY,{
			expiresIn: 60*60,
		})
  },

	check: token => {
		//return KoaJwt({ secret: secrets.SERVER_SECRET_KEY })
		let check
		try{
			check = jwt.verify(token, secrets.SERVER_SECRET_KEY)
		} catch (e) {
			console.log(e.message)
			if (e.message.match(/invalid/i)) throw Boom.unauthorized('Token provided is invalid, signature has been altered.') 
			if (e.message.match(/expire/i)) throw Boom.unauthorized('Token has expired, login again and get a new one')
			// generic error
			throw Boom.unauthorized('There was an error with the auth token, get a new one relogging in.')
		}
	},
	
	auth: async (ctx, next) => {
		let Authorization = ctx.headers.authorization || ctx.headers.Authorization
		if (!Authorization) {
			ctx.status = 401 
			throw Boom.unauthorized('Auth Token Not Provided')	
		} 
		if (!Authorization.match(/^Bearer\ /)) {
			ctx.status = 401 
			throw Boom.unauthorized('Invalid auth token provided')
		}	
		let token = Authorization.replace(/^Bearer\ /,'')
		JwtHandlers.check(token) // will throw errors let it go upstream
		await next()
	},

	refresh: token => {
	
	},
}

module.exports = JwtHandlers
