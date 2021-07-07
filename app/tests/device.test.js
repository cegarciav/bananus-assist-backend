const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

let centralTablet = null;
let salePoint = null;
let store = null;
let device = null;
let token;
describe('device CRUD Testing', () => {
  beforeAll(async () => {
    // Create a store point to use its ID in the tests
    await user.create({
      id: uuid(),
      name: 'admin',
      password: '123',
      email: 'admin@hotmail.cl',
      rol: 'administrator',
    });

    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@hotmail.cl',
        password: '123',
      });

    token = login.body.token;
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      }).set({
        authorization: token,
      });

    const stores = await request(app)
      .get('/stores').set({
        authorization: token,
      });

    [store] = stores.body;
    // Create a sale point to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department in Devices',
      }).set({
        authorization: token,
      });
    const salePoints = await request(app)
      .get('/sale-points').set({
        authorization: token,
      });
    [salePoint] = salePoints.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139123',
        password: '12345',
      }).set({
        authorization: token,
      });
    const centralTablets = await request(app)
      .get('/central-tablets').set({
        authorization: token,
      });
    [centralTablet] = centralTablets.body;

    // Create a device  to use its ID in the tests
    await request(app)
      .post('/devices')
      .send({
        centralTabletId: centralTablet.id,
        serialNumber: '100102312-2139321',
        password: '12345',
      }).set({
        authorization: token,
      });
    const devices = await request(app)
      .get('/devices').set({
        authorization: token,
      });
    [device] = devices.body;
  });

  // CREATE

  it('should fail creating a device because fields not provided', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a device because central_tabletId is not provided', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        serialNumber: '100102312-2139324',
        password: '12345',
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
        password: '12345',
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
        centralTabletId: centralTablet.id,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a device because central_tabletId doesnt exist in database', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        serialNumber: '100102312-2139324',
        centralTabletId: 'FAKE-ID',
        password: '12345',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid central tablet id');
  });

  it('should create a new device', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        centralTabletId: centralTablet.id,
        serialNumber: '100102312-2139324',
        password: '12345',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail create a device because serial number already in use', async () => {
    const res = await request(app)
      .post('/devices')
      .send({
        centralTabletId: centralTablet.id,
        serialNumber: '100102312-2139324',
        password: '12345',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("There's another device or central tablet with the same serial number");
  });

  // READ ALL

  it('should read all devices', async () => {
    const res = await request(app)
      .get('/devices');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE

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
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Device serial number doesn't exist");
  });

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

  // UPDATE

  it('should fail updating  because serialNumber is not sent', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating  because serialNumber not exists', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Device serial number doesn't exist");
  });

  it('should fail updating  because serialNumber already in use', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
        serialNumber: device.serialNumber,
        new_serialNumber: device.serialNumber,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('This serial number already exist');
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
  it('should fail updating the central_tabletId of one device', async () => {
    const res = await request(app)
      .patch('/devices')
      .send({
        serialNumber: '100102312-21391320',
        new_serialNumber: device.serialNumber,
        centralTabletId: 'FAKE',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid central tablet id');
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
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Device serial number doesn't exist");
  });

  it('should delete one device', async () => {
    const res = await request(app)
      .delete('/devices')
      .send({
        serialNumber: '100102312-21391320',
      });
    expect(res.statusCode).toEqual(204);
  });

  afterAll(async () => {
    // Delete all devices created
    const devices = await request(app)
      .get('/devices').set({
        authorization: token,
      });

    await Promise.all(devices.body
      .map(async (sp) => {
        await request(app)
          .delete('/devices')
          .send({
            serialNumber: sp.serialNumber,
          }).set({
            authorization: token,
          });
      }));

    // Delete central tablet created
    await request(app)
      .delete('/central-tablets')
      .send({
        serialNumber: centralTablet.serialNumber,
      }).set({
        authorization: token,
      });

    // Delete sale_point created
    await request(app)
      .delete('/sale-points')
      .send({
        id: salePoint.id,
      }).set({
        authorization: token,
      });

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store.address,
      }).set({
        authorization: token,
      });
    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });
  });
});
