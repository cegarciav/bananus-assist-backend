/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

describe('Session endpoints testing', () => {
  let token_device;
  let token_central_tablet;
  let store;
  let sale_point;
  let central_tablet;
  let device;
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

    [sale_point] = salePoints.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/central-tablets')
      .send({
        salePointId: sale_point.id,
        serialNumber: '100102312-2139123',
        password: '12345',
      });

    const centralTablets = await request(app)
      .get('/central-tablets');

    [central_tablet] = centralTablets.body;

    await request(app)
      .post('/devices')
      .send({
        centralTabletId: central_tablet.id,
        serialNumber: '100102312-2139321',
        password: '12345',
      });
    const devices = await request(app)
      .get('/devices');

    [device] = devices.body;
  });

  // FAIL CREATE
  it('should fail in create a new session because this device doesnt exist', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: '100102312-5549351',
        password: 'BAD_PASSWORD',
      });
    expect(res4.statusCode).toEqual(400);
  });
  it('should fail in create a new session because the serialNumber is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
  });
  it('should fail in create a new session because the password is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: '100102312-2139321',
      });
    expect(res4.statusCode).toEqual(400);
  });
  // CREATE
  it('should create a new  device session', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: device.serialNumber,
        password: '12345',
      });
    expect(res4.statusCode).toEqual(200);
    expect(res4.body.token).toBeTruthy();
    token_device = res4.body.token;
  });
  it('should create a new  central tablet session', async () => {
    const tablet_session = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: central_tablet.serialNumber,
        password: '12345',
      });
    expect(tablet_session.statusCode).toEqual(200);
    expect(tablet_session.body.token).toBeTruthy();
    token_central_tablet = tablet_session.body.token;
  });
  // FAIL DELETE
  it('should fail in delete session because the body is empty', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send();
    expect(res5.statusCode).toEqual(400);
  });

  it('should fail in delete session because token attribute is not a token', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('token', 'IM NOT A JWT');
    expect(res5.statusCode).toEqual(400);
  });
  // DELETE
  it('should delete session for a device', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('token', token_device);
    expect(res5.statusCode).toEqual(200);
  });

  it('should delete session for a central tablet', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('token', token_central_tablet);
    expect(res5.statusCode).toEqual(200);
  });

  afterAll(async () => {
    // Delete all devices created
    const devices_test = await request(app)
      .get('/devices');

    devices_test.body.forEach(async (dv) => {
      await request(app)
        .delete('/devices')
        .send({
          serialNumber: dv.serialNumber,
        });
    });

    const central_tablets_test = await request(app)
      .get('/central-tablets');

    central_tablets_test.forEach(async (ct) => {
      await request(app)
        .delete('/central-tablets')
        .send({
          serialNumber: ct.serialNumber,
        });
    });

    const sale_points_test = await request(app)
      .get('/sale-points');

    sale_points_test.forEach(async (sp) => {
      await request(app)
        .delete('/sale-points')
        .send({
          id: sp.id,
        });
    });

    const stores_test = await request(app)
      .get('/stores');

    stores_test.forEach(async (st) => {
      await request(app)
        .delete('/stores')
        .send({
          id: st.id,
        });
    });
  });
});
