//* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let centralTablet = null;
let salePoint = null;
let store = null;
let device = null;

describe('device CRUD Testing', () => {
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

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139123',
        password: "12345"
      });
    const centralTablets = await request(app)
      .get('/central-tablets');
    [centralTablet] = centralTablets.body;

    // Create a device  to use its ID in the tests
  await request(app)
  .post('/devices')
  .send({
    centralTabletId: centralTablet.id,
    serialNumber: '100102312-2139321',
    password: "12345"
  });
    const devices = await request(app)
    .get('/devices');
    [device] = devices.body;
  });

  

  // CREATE
  it('should create a new device', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        centralTabletId: centralTablet.id,
        serialNumber: '100102312-2139324',
        password: "12345"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail creating a device because central_tabletId is not provided', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        serialNumber: '100102312-2139324',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a device because serialNumber is not provided', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        centralTabletId: centralTablet.id,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a device because password is not provided', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        serialNumber: '100102312-2139324',
        centralTabletId: centralTablet.id
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  // READ ALL
  it('should read all devices', async () => {
    const res = await request(app)
      .get('/devices');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE
  it('should read one device', async () => {
    const res = await request(app)
      .post('/devices/show')
      .send({
        serialNumber: device.serialNumber,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.serialNumber).toEqual(device.serialNumber);
    expect(res.body.sale_pointId).toEqual(device.sale_pointId);
  });

  it('should fail reading one device because serial Number is not sent', async () => {
    const res = await request(app)
      .post('/devices/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one device because id doesn\'t exist', async () => {
    const res = await request(app)
      .post('/devices/show')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Device serial number doesn\'t exist");
  });

  //UPDATE
  it('should fail updating  because serialNumber is not sent', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should update the serialNumber of one device', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
        serialNumber: device.serialNumber,
        new_serialNumber: '100102312-21391320',
      });
    expect(res.statusCode).toEqual(200);
  });

  // DELETE
  it('should fail deleting one device because id is not sent', async () => {
    const res = await request(app)
      .delete('/devices')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one device because id doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/devices')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Device serial number doesn\'t exist");
  });

  it('should delete one device', async () => {
    const res = await request(app)
      .delete('/devices')
      .send({
        serialNumber: '100102312-21391320'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all devices created
    const devices = await request(app)
      .get('/devices');

      devices.body.forEach(async (sp) => {
      await request(app)
        .delete('/devices')
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
    await request(app)
    .delete('/sale-points')
    .send({
      id: salePoint.id,
    });

    //Delete central tablet created
    await request(app)
    .delete('/central-tablets')
    .send({
      serialNumber: centralTablet.serialNumber,
    });
  });
});
