const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
// const request = require('supertest')
const User = require(PATHS.getServerNode('models/user.model'))

chai.use(chaiHttp)

const app = require(PATHS.app)

describe('User Controller', () => {
  let authToken
  /**
   * Create
   */
  describe('Create', () => {
    it('should throw error with no data', (done) => {
      chai.request(app).post('/users')
      .catch((err) => {
        let { body } = err.response
        expect(body.statusCode).to.equal(400)
        done()
      }).catch(done)
    })

    it('should throw error with partial data', (done) => {
      chai.request(app).post('/users').send({
        username: 'admin'
      })
      .catch((err) => {
        let { body } = err.response
        expect(body.statusCode).to.equal(400)
        done()
      }).catch(done)
    })

    it('should throw error with partial data', (done) => {
      chai.request(app).post('/users').send({
        username: 'admin',
        password: 'admin',
      })
      .catch((err) => {
        let { body } = err.response
        expect(body.statusCode).to.equal(400)
        done()
      }).catch(done)
    })

    it('should create', (done) => {
      chai.request(app).post('/users').send({
        username: 'admin',
        password: 'admin',
        email: 'simonecorsi.rm@gmail.com'
      })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      }).catch(done)
    })
  })

  /**
   * Index
   */

  /**
   * Get
   */

  /**
   * Delete
   */

  /**
   * CLEANUP
   */
  after(() => User.destroy({ truncate: true }))
})
