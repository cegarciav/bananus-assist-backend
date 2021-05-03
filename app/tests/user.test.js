const request = require('supertest')
const app = require('../server')

describe('User CRUD Testing', () => {

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: "test",
        email: "test01@test.cl",
        password: "1233"
      })
    expect(res.statusCode).toEqual(201)
  }),
  it('should read all users', async () => {
    const res = await request(app)
      .get('/users')
      
    expect(res.statusCode).toEqual(200)
  }),
  it('should read one user', async () => {
    const res = await request(app)
      .get('/users')
      .send({
        email: "test01@test.cl",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should update the email of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        new_email: "testupdate@test.cl",
        email: "test01@test.cl",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should fail delete one user', async () => {
    const res = await request(app)
      .delete('/users')
      .send({
        email: "test01@test.cl",
      })
    expect(res.statusCode).toEqual(400)
  }),
  it('should update the name of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        name: "update",
        email: "testupdate@test.cl",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should update the password of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: "testupdate@test.cl",
        password: "update",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should delete one user', async () => {
    const res = await request(app)
      .delete('/users')
      .send({
        email: "testupdate@test.cl",
      })
    expect(res.statusCode).toEqual(200)
  })
})