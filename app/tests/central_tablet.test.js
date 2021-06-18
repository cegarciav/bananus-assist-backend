//* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let centralTablet = null;
let salePoint = null;
let store = null;

describe('Central Tablet CRUD Testing', () => {
  beforeAll(async () => {
    
    // Create a store point to use its ID in the tests
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      });

    const stores = await request(app)
      .get('/stores');

    [store] = stores.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department',
      });
    const salePoints = await request(app)
      .get('/sale-points');
    [salePoint] = salePoints.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139123',
      });
    const centralTablets = await request(app)
      .get('/central-tablets');
    [centralTablet] = centralTablets.body;
  });

  // CREATE
  it('should create a new central tablet', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139124',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail creating a central tablet because salePointId is not provided', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        serialNumber: '100102312-2139124',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a central tablet because serialNumber is not provided', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  // READ ALL
  it('should read all central tablets', async () => {
    const res = await request(app)
      .get('/central-tablets');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE
  it('should read one central tablet', async () => {
    const res = await request(app)
      .post('/central-tablets/show')
      .send({
        serialNumber: centralTablet.serialNumber,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.serialNumber).toEqual(centralTablet.serialNumber);
    expect(res.body.sale_pointId).toEqual(centralTablet.sale_pointId);
  });

  it('should fail reading one central tablet because serial Number is not sent', async () => {
    const res = await request(app)
      .post('/central-tablets/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one central tablet because id doesn\'t exist', async () => {
    const res = await request(app)
      .post('/central-tablets/show')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Central tablet serial number doesn\'t exist");
  });

  //UPDATE
  it('should fail updating  because serialNumber is not sent', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should update the serialNumber of one central tablet', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
        serialNumber: centralTablet.serialNumber,
        new_serialNumber: '100102312-2139120',
      });
    expect(res.statusCode).toEqual(200);
  });

  // DELETE
  it('should fail deleting one central tablet because id is not sent', async () => {
    const res = await request(app)
      .delete('/central-tablets')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one central tablet because id doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/central-tablets')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Central tablet serial number doesn\'t exist");
  });

  it('should delete one central tablet', async () => {
    const res = await request(app)
      .delete('/central-tablets')
      .send({
        serialNumber: '100102312-2139124'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all central tablets created
    const centralTablets = await request(app)
      .get('/central-tablets');

      centralTablets.body.forEach(async (sp) => {
      await request(app)
        .delete('/central-tablets')
        .send({
          serialNumber: sp.serialNumber,
        });
    });

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store.address,
      });

      //Delete sale_point created
      // Delete store created
    await request(app)
    .delete('/sale-points')
    .send({
      id: salePoint.id,
    });
  });
});
