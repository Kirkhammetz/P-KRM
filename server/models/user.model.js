var bcrypt = require('bcrypt')
const db = require('../configs/database')
const jwt = require('../libs/jwt')

/**
 * SCHEMA
 */
const User = db.define('users', {
  admin: {
    type: db.Sequelize.BOOLEAN,
    defaultValue: false,
  },

  username: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: { args: true, msg: 'username exist' },
    validate: {
      notEmpty: { args: true, msg: 'username cannot be empty' },
    },
  },

  password: {
    type: db.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { args: true, msg: 'password cannot be empty' },
    },
  },

  email: {
    type: db.Sequelize.STRING,
    unique: { args: true, msg: 'User with this email already exist.' },
    validate:{
      isEmail: true,
      notEmpty: true,
    },
  },

}, {
  freezeTableName: true,

  /**
   * Class Methods
   */
  classMethods: {
  },

  /**
   * Instance Methods
   */
  instanceMethods: {
    comparePassword: function comparePassword(password) {
      const user = this
      const promise = new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) return reject(err)
          return resolve(res)
        })
      })
      return promise
    },
    auth: function auth() {
      const user = this
      let payload = { id: user.id, username: user.username, email: user.email }
      try {
        return jwt.sign(payload)
      } catch (e) {
        throw e
      }
    }
  },
})

/**
 * HOOKS
 */

//  Create Password Hash ASYNC
function hashPassword(password) {
 const promise = new Promise((resolve, reject) => {
   bcrypt.hash(password, 10, (err, hash) => {
     if (err) return reject(err)
     return resolve(hash)
   })
 })
 return promise
}

User.hook('beforeCreate', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await hashPassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

User.hook('beforeSave', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await hashPassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

User.hook('beforeUpdate', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await hashPassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

// if (process.env.NODE_ENV !== 'production') User.sync({ force: true })
User.sync()

module.exports = User
