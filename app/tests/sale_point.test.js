//* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let store = null;
let salePoint = null;

describe('Sale Point CRUD Testing', () => {
  beforeAll(async () => {
    // Create a new store to use its ID in the tests
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      });

    const stores = await request(app)
      .get('/stores');

    [store] = stores.body;

    // Create a sale point to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department',
      });
    const salePoints = await request(app)
      .get('/sale-points');
    [salePoint] = salePoints.body;
  });

  // CREATE

  it('should fail creating a sale point because fields not provided', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a sale point because storeId is not provided', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        department: 'Another Department',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a sale point because department is not provided', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a sale point because store not exists', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        storeId: 9999999999,
        department: 'Another Department',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should create a new sale point', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Another Department',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail create a sale point because sale point already exists', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Another Department',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Sale point already exist');
  });

  // READ ALL
  it('should read all sale points', async () => {
    const res = await request(app)
      .get('/sale-points');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE
  it('should fail reading one sale point because id is not sent', async () => {
    const res = await request(app)
      .post('/sale-points/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one sale point because id doesn\'t exist', async () => {
    const res = await request(app)
      .post('/sale-points/show')
      .send({
        id: 99999999999,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Sale point doesn't exist");
  });

  it('should read one sale point', async () => {
    const res = await request(app)
      .post('/sale-points/show')
      .send({
        id: salePoint.id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(salePoint.id);
    expect(res.body.storeId).toEqual(store.id);
    expect(res.body.department).toEqual('Some Department');
  });

  // UPDATE

  it('should fail updating department because id is not sent', async () => {
    const res = await request(app)
      .patch('/sale-points')
      .send({
        department: 'New department value',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating department because id not exists', async () => {
    const res = await request(app)
      .patch('/sale-points')
      .send({
        id: 99999999999,
        department: 'New department value',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Sale point doesnt exist');
  });

  it('should fail updating department because store not exists', async () => {
    const res = await request(app)
      .patch('/sale-points')
      .send({
        id: salePoint.id,
        storeId: 99999999999,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should fail updating department because sale point already exists', async () => {
    const res = await request(app)
      .patch('/sale-points')
      .send({
        id: salePoint.id,
        storeId: store.id,
        department: 'Another Department',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Sale point already exist');
  });

  it('should update the department of one sale point', async () => {
    const res = await request(app)
      .patch('/sale-points')
      .send({
        id: salePoint.id,
        department: 'New department value',
      });
    expect(res.statusCode).toEqual(200);
  });

  // DELETE
  it('should fail deleting one sale point because id is not sent', async () => {
    const res = await request(app)
      .delete('/sale-points')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one sale point because id doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/sale-points')
      .send({
        id: 99999999999,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Sale's id doesn't exist");
  });

  it('should delete one sale point', async () => {
    const res = await request(app)
      .delete('/sale-points')
      .send({
        id: salePoint.id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all sale points created
    const salePoints = await request(app)
      .get('/sale-points');

    salePoints.body.forEach(async (sp) => {
      await request(app)
        .delete('/sale-points')
        .send({
          id: sp.id,
        });
    });

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store.address,
      });
  });
});
