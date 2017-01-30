const Sequelize = require('sequelize')

const secrets = require('./secrets')
const db = new Sequelize(
  secrets.DB_DATABASE,
  secrets.DB_USERNAME,
  secrets.DB_PASSWORD,
  {
    host: secrets.DB_HOST,
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    benchmark: true,
  }
)

db.sync().then((res) => {
  console.log('database connected')
}).catch((err) => {
  console.log(`Error connecting to database: ${err.message}`)
  throw err
})

module.exports = db
