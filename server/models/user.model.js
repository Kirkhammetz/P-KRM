const db = require('../configs/database')
const jwt = require('../libs/jwt')
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'))

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
    allowNull: false,
    validate:{
      isEmail: true,
      notEmpty: true,
    },
  },

	lastOnline: {
		type: db.Sequelize.DATE,
	},

  resetToken: {
    type: db.Sequelize.STRING,
  },

}, {
  freezeTableName: true,

  /**
   * ------------
   * Class Methods
   * ------------
   */
  classMethods: {
  },

  /**
   * ----------------
   * Instance Methods
   * ----------------
   */
  instanceMethods: {
    /**
     * Generate a Password
     * Wrap bcrypt's hashing in a promise to use with async/await
     * @return {[Promise]}
     */
    generatePassword: password => bcrypt.hashAsync(password, 10),

    /**
     * Compare Password
     * Wrap bcrypt's compare in promise to use with async/await
     * @return {[Promise]}
     */
    comparePassword: function comparePassword(password) {
      const user = this
      return bcrypt.compareAsync(password, user.password)
    },
    /**
     * Serialize a JWT with user info.
     * @return Payload string, or throw.
     */
    auth: function auth() {
      const user = this
      let payload = { id: user.id, username: user.username, email: user.email }
      try {
        let token = jwt.sign(payload)
				user.update({ lastOnline: Date.now() })
				return token
      } catch (e) {
        throw e
      }
    }
  },
})

/**
 * -------------
 * ACTIONS HOOKS
 * -------------
 */

User.hook('beforeCreate', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await user.generatePassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

User.hook('beforeSave', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await user.generatePassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

User.hook('beforeUpdate', async (user) => {
  if (user.changed('password')) {
    try {
      user.password = await user.generatePassword(user.password)
    } catch (e) {
      throw new Error('There was an error hashing the password.')
    }
  }
})

if (process.env.NODE_ENV === 'test') {
	User.sync({ force: true })
} else {
	User.sync()
}

module.exports = User
