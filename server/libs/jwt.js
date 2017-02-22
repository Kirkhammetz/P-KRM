const secrets = require('../configs/secrets')
const jwt = require('jsonwebtoken')

module.exports = {
  sign: (payload) => {
    if (!payload) throw new Error('No payload provided to jwt sign method')
    return jwt.sign(payload, secrets.SERVER_SECRET_KEY,{
			expiresIn: 1,
		})
  },
}
