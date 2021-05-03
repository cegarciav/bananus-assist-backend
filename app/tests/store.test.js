const request = require('supertest')
const app = require('../server')

describe('Store CRUD Testing', () => {
    
  it('should create a new store', async () => {
    const res = await request(app)
      .post('/stores')
      .send({
        name: "test_store",
        address: "test_street 123"
      })
    expect(res.statusCode).toEqual(201)
  }),
  it('should read all stores', async () => {
    const res = await request(app)
      .get('/stores')
      
    expect(res.statusCode).toEqual(200)
  }),
  it('should read one store', async () => {
    const res = await request(app)
      .get('/stores')
      .send({
        address: "test_street 123",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should update the address of one store', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        new_address: "new store address 456",
        address: "test_street 123",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should fail delete one user', async () => {
    const res = await request(app)
      .delete('/stores')
      .send({
        address: "test_street 123",
      })
    expect(res.statusCode).toEqual(400)
  }),
  it('should update the name of one store', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        name: "new_test_store_name",
        address: "new store address 456",
      })
    expect(res.statusCode).toEqual(200)
  }),
  it('should delete one store', async () => {
    const res = await request(app)
      .delete('/stores')
      .send({
        address: "new store address 456",
      })
    expect(res.statusCode).toEqual(200)
  })


})