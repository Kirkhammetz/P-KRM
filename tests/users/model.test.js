const {expect} = require('chai')
const User = require(PATHS.getServerNode('models/user.model'))

describe('User Model', () => {
  let userInstance

  /**
   * Creation
   */
  describe('Creation', () => {
    it('should throw error if no username passed ', async () => {
      try {
        let res = await User.create({})
      } catch (e) {
        expect(e.errors).to.exist
        expect(e instanceof Error).to.equal(true)
      }
    })

    it('should throw error if no email passed ', async () => {
      try {
        let res = await User.create({ username: 'admin' })
      } catch (e) {
        expect(e.errors).to.exist
        expect(e instanceof Error).to.equal(true)
      }
    })

    it('should throw error if no password passed ', async () => {
      try {
        let res = await User.create({ username: 'admin', email: 'test@email.com' })
      } catch (e) {
        expect(e.errors).to.exist
        expect(e instanceof Error).to.equal(true)
      }
    })

    it('should create user', async () => {
      let res
      try {
        res = await User.create({ username: 'admin', email: 'admin@email.com', password: 'admin' })
      } catch (e) {
        expect(e).to.not.exist
        expect(e instanceof Error).to.equal(true)
      }
      expect(res).to.exist
      expect(res.username).to.equal('admin')
      expect(res.email).to.equal('admin@email.com')
      expect(res.password).to.not.equal('admin')
      userInstance = res
    })
  })

  /**
   * Methods
   */
  describe('Instance Methods', () => {
    /**
     * generatePassword()
     */
    it('istance.generatePassword() should return a bcrypt hash', async () => {
      let hash = await userInstance.generatePassword('password')
      expect(hash).to.exist
      expect(hash).to.not.equal('password')
    })
    it('istance.generatePassword() should throw if no pwd provided', async () => {
      try{
        let hash = await userInstance.generatePassword('password')
      } catch(e) {
        expect(e).to.exist
        expect(e instanceof Error).to.equal(true)
      }
    })

    /**
     * comparePassword()
     */
    it('instance.comparePassword() should return true', async () => {
      let hash = await userInstance.comparePassword('admin')
      expect(hash).to.exist
      expect(hash).to.equal(true)
    })
    it('instance.comparePassword() should return false', async () => {
      let hash = await userInstance.comparePassword('password')
      expect(hash).to.exist
      expect(hash).to.equal(false)
    })
    it('instance.comparePassword() should throw if no value passed', async () => {
      try{
        let hash = await userInstance.comparePassword()
        console.log(hash)
      } catch(e) {
        expect(e).to.exist
      }
    })

    /**
     * auth()
     */
    it('should return a signed JWT', () => {
      expect(userInstance.auth()).to.exist.to.be.a('string')
    })
  })


  /**
   * Cleanup
   */
  after(() => User.destroy({ truncate: true }))
})
