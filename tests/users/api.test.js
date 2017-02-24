const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const User = require(PATHS.getServerNode('models/user.model'))

chai.use(chaiHttp)

const app = require(PATHS.app)

describe('User Controller', () => {
  let authToken, userId
  let adminUser = {
    username: 'admin',
    password: 'admin',
    email: 'test@valid.com',
  }
  /**
   * Create
   */
  describe('Create', () => {
    it('should throw error with no data', (done) => {
      chai.request(app).post('/users')
      .catch((err) => {
        let { body } = err.response
        expect(body.statusCode).to.eql(400)
        done()
      }).catch(done)
    })

    it('should throw error with partial data', (done) => {
      chai.request(app).post('/users').send({
        username: 'admin'
      })
      .catch((err) => {
        let { body } = err.response
        expect(body.statusCode).to.eql(400)
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
        expect(body.statusCode).to.eql(400)
        done()
      }).catch(done)
    })

    it('should create', (done) => {
      chai.request(app).post('/users').send(adminUser)
      .then((res) => {
				expect(res.statusCode).to.eql(200)
				expect(res.body).to.exist
				expect(res.body.user).to.exist
        done()
      }).catch(done)
    })
  })

  /**
   * Auth
   */
  describe('Auth', () => {
    it('should return error if email missing', () => {
      chai.request(app).post('/auth').send({}).catch(err => {
        expect(err.status).to.eql(400)
      })
    })

    it('should return error if password missing', () => {
      chai.request(app).post('/auth').send({ email: 'test@example.com' }).catch(err => {
				let { body } = err.response
				expect(body.error).to.exist
				expect(body.statusCode).to.eql(400)
      })
    })

		it('should return error if user dont exist', (done) => {
			chai.request(app).post('/auth').send({
				email: 'test@invalid.com',
				password: 'invalid'
			})
			.catch(err => {
				let { response } = err
				expect(response.body.statusCode).to.eql(404)
				expect(response.body.error).to.exist
				expect(response.body.error).to.match(/not found/i)
				done()
			})
		})

		it('should return error if password incorrect', done => {
			chai.request(app).post('/auth').send({
				email: adminUser.email,
				password: 'invalid'
			}).catch(err => {
				let { body } = err.response
				expect(body).to.exist
				expect(body.statusCode).to.eql(403)
				expect(body.error).to.exist
				expect(body.error).to.match(/forbidden/i)
				done()
			})
		})

    it('should auth', (done) => {
      chai.request(app).post('/auth').send(adminUser)
        .then((res) => {
					let { body } = res
          authToken = body.authToken
					expect(body).to.exist
					expect(body.authToken).to.exist
					expect(res.statusCode).to.eql(200)
          done()
        }).catch(done)
    })
  })

  /**
   * Index
   */
	describe('Indexing', () => {
		it('should not index without token', done => {
			chai.request(app).get('/users').catch(res => {
				let { body } = res.response
				expect(res.response.statusCode).to.eql(401)
				expect(body).to.exist
				expect(body.message).to.exist
				done()
			})
		})
		it('should not index with invalid token', done => {
			chai.request(app)
			.get('/users')
			.set('Authorization', `Bearer ${authToken}i123`)
			.catch(res => {
				let { body } = res.response
				expect(res.response.statusCode).to.eql(401)
				expect(body).to.exist
				expect(body.message).to.exist
				done()
			})
		})
		it('should index', done => {
			chai.request(app)
			.get('/users')
			.set('Authorization', `Bearer ${authToken}`)
			.then(res => {
				let { body, statusCode } = res
				expect(body).to.exist
				expect(statusCode).to.eql(200)
				expect(body.users).to.exist.to.be.a('array').to.have.length(1)
				userId = body.users[0].id
				expect(userId).to.exist
				done()
			}).catch(done)
		})

	})

  /**
   * Get
   */
	describe('Get Single', () => {
		it('should not index without token', done => {
			chai.request(app).get('/users/1').catch(res => {
				let { body, statusCode } = res.response
				expect(statusCode).to.eql(401)
				expect(body).to.exist
				expect(body.message).to.exist
				done()
			}).catch(done)
		})
		it('should not get with invalid auth token', done => {
			chai.request(app)
			.get('/users/1')
			.set('Authorization', `Bearer ${authToken}i123`)
			.catch(res => {
				let { body, statusCode } = res.response
				expect(statusCode).to.eql(401)
				expect(body).to.exist
				expect(body.message).to.exist
				done()
			}).catch(done)
		})
		it('should return 404 if not found', done => {
			chai.request(app)
			.get('/users/12345')
			.set('Authorization', `Bearer ${authToken}`)
			.catch(res => {
				let { body } = res.response
				expect(body).to.exist
				expect(res.response.statusCode).to.eql(404)
				done()
			}).catch(done)
		})
		it('should get', done => {
			chai.request(app)
			.get(`/users/${userId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.then(res => {
				const { body } = res
				const { user } = res.body
				expect(body).to.exist
				expect(user).to.exist
				expect(user.email).to.eql(adminUser.email)
				expect(user.username).to.eql(adminUser.username)
				done()
			}).catch(done)
		})
	})

  /**
   * Delete
   */
	describe('Delete', () => {
			it('should not delete without token', done => {
			chai.request(app).delete('/users/1').catch(res => {
				let { body, statusCode } = res.response
				expect(statusCode).to.eql(401)
				expect(body).to.exist
				expect(body.message).to.exist
				done()
			}).catch(done)
		})

		it('should return 404 if not found', done => {
			chai.request(app)
			.get('/users/12345')
			.set('Authorization', `Bearer ${authToken}`)
			.catch(res => {
				let { body } = res.response
				expect(body).to.exist
				expect(res.response.statusCode).to.eql(404)
				done()
			})
		})

		it('should delete', done => {
			chai.request(app)
			.delete(`/users/${userId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.then(res => {
				const { body } = res
				expect(res.statusCode).to.eql(200)
				expect(res.body.success).to.eql(true)
				done()
			}).catch(done)
		})
	})

  /**
   * CLEANUP
   */
  after(() => User.destroy({ truncate: true }))
})
