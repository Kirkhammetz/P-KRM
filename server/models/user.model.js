var bcrypt = require('bcrypt')
const db = require('../configs/database')

/**
 * SCHEMA
 */
const User = db.define('user', {
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
      notEmpty: { args: true, msg: 'username cannot be empty' },
    },
  },

  email: {
    type: db.Sequelize.STRING,
    validate:{
      isEmail: true,
      notEmpty: true,
    },
  },

}, {
  freezeTableName: true,
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

User.sync() // TODO: should be moved to a setup module.

module.exports = User
