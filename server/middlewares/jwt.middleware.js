const jwt = require('koa-jwt')
const secrets = require('../configs/secrets')

module.exports = jwt({ secret: secrets.SERVER_SECRET_KEY })
