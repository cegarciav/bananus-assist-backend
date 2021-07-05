/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

describe('Store CRUD Testing', () => {
  // CREATE

  it('should fail creating a new store because address and name not provided', async () => {
    const res = await request(app)
      .post('/stores')
      .send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a new store because address is not provided', async () => {
    const res = await request(app)
      .post('/stores')
      .send({
        name: 'test_store 2',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a new store because name is not provided', async () => {
    const res = await request(app)
      .post('/stores')
      .send({
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should create a new store', async () => {
    const res = await request(app)
      .post('/stores')
      .send({
        name: 'test_store',
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail creating a new store because a store already exists for an address', async () => {
    const res = await request(app)
      .post('/stores')
      .send({
        name: 'test_store 2',
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("There's another store in the same address");
  });

  // READ ALL

  it('should read all stores', async () => {
    const res = await request(app)
      .get('/stores');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE

  it('should fail reading one store because address is not sent', async () => {
    const res = await request(app)
      .post('/stores/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one store because address doesn\'t exist', async () => {
    const res = await request(app)
      .post('/stores/show')
      .send({
        address: 'A fake address that has never been created',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Store address doesn't exist");
  });

  it('should read one store', async () => {
    const res = await request(app)
      .post('/stores/show')
      .send({
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.address).toEqual('test_street 123');
    expect(res.body.name).toEqual('test_store');
  });

  // UPDATE

  it('should fail updating name because address is not sent', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        name: 'New test store name',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating name because address doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        name: 'New test store name',
        address: 'A fake address that has never been created',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Store address doesn't exist");
  });

  it('should fail updating address because it already exists', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        new_address: 'test_street 123',
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('This address already exist');
  });

  it('should update the address of one store', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        new_address: 'new store address 456',
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should update the name of one store', async () => {
    const res = await request(app)
      .patch('/stores')
      .send({
        name: 'new_test store name',
        address: 'new store address 456',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  // DELETE
  it('should fail deleting one store because address is not sent', async () => {
    const res = await request(app)
      .delete('/stores')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one store because address doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/stores')
      .send({
        address: 'test_street 123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Store address doesn't exist");
  });

  it('should delete one store', async () => {
    const res = await request(app)
      .delete('/stores')
      .send({
        address: 'new store address 456',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    const stores_test = await request(app)
      .get('/stores');

    await Promise.all(stores_test.body
      .map(async (st) => {
        await request(app)
          .delete('/stores')
          .send({
            address: st.address,
          });
      }));
  });
});
