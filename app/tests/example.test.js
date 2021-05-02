const request = require('supertest')
const app = require('../server')
describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: "a",
        email: "matias",
        password: "123"
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body.state).toEqual('OK')
  })
})