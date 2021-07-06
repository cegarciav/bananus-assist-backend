const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

describe('Session endpoints testing', () => {
  let token;
  let token_device;
  let token_central_tablet;
  let store;
  let sale_point;
  let central_tablet;
  let device;
  beforeAll(async () => {
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

    // Create a store point to use its ID in the tests
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

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department in Session Devices',
      }).set({
        authorization: token,
      });

    const salePoints = await request(app)
      .get('/sale-points').set({
        authorization: token,
      });

    [sale_point] = salePoints.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/central-tablets')
      .send({
        salePointId: sale_point.id,
        serialNumber: '100102312-2139123',
        password: '12345',
      }).set({
        authorization: token,
      });

    const centralTablets = await request(app)
      .get('/central-tablets').set({
        authorization: token,
      });

    [central_tablet] = centralTablets.body;

    await request(app)
      .post('/devices')
      .send({
        centralTabletId: central_tablet.id,
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
  it('should fail in create a new session because fields not sent', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({});
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session because the serialNumber is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session because the password is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: '100102312-2139321',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session because this device doesnt exist', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: '100102312-5549351',
        password: '12345',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid Serial Number or password');
  });

  it('should fail in create a new session because wrong password', async () => {
    const res4 = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: device.serialNumber,
        password: 'BAD_PASSWORD',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid Serial Number or password');
  });

  it('should create a new device session', async () => {
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

  it('should fail create a new device session because already log in', async () => {
    const res = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: device.serialNumber,
        password: '12345',
      })
      .set('authorization', token_device);
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('You must be unlogged to do this');
  });

  it('should create a new central tablet session', async () => {
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

  it('should fail create a new central tablet session because already log in', async () => {
    const res = await request(app)
      .post('/sessions/devices')
      .send({
        serialNumber: central_tablet.serialNumber,
        password: '12345',
      })
      .set('authorization', token_central_tablet);
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('You must be unlogged to do this');
  });

  // DELETE
  it('should fail in delete session because not log in', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send();
    expect(res5.statusCode).toEqual(400);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('You must be logged to do this');
  });

  it('should fail in delete session because token attribute is not a token', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('authorization', 'IM NOT A JWT');
    expect(res5.statusCode).toEqual(400);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('You must be logged to do this');
  });

  it('should fail delete session because device is not an user', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('authorization', token_device);
    expect(res5.statusCode).toEqual(400);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('Only users can do this action');
  });

  it('should fail delete session because central tablet is not an user', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('authorization', token_central_tablet);
    expect(res5.statusCode).toEqual(400);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('Only users can do this action');
  });

  it('should delete device session', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('authorization', token_device);
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.state).toEqual('OK');
  });

  it('should delete central tablet session', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('authorization', token_central_tablet);
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all devices created
    const devices_test = await request(app)
      .get('/devices').set({
        authorization: token,
      });

    await Promise.all(devices_test.body
      .map(async (dv) => {
        await request(app)
          .delete('/devices')
          .send({
            serialNumber: dv.serialNumber,
          }).set({
            authorization: token,
          });
      }));

    const central_tablets_test = await request(app)
      .get('/central-tablets').set({
        authorization: token,
      });

    await Promise.all(central_tablets_test.body
      .map(async (ct) => {
        await request(app)
          .delete('/central-tablets')
          .send({
            serialNumber: ct.serialNumber,
          }).set({
            authorization: token,
          });
      }));

    const sale_points_test = await request(app)
      .get('/sale-points').set({
        authorization: token,
      });

    await Promise.all(sale_points_test.body
      .map(async (sp) => {
        await request(app)
          .delete('/sale-points')
          .send({
            id: sp.id,
          }).set({
            authorization: token,
          });
      }));

    const stores_test = await request(app)
      .get('/stores').set({
        authorization: token,
      });

    await Promise.all(stores_test.body
      .map(async (st) => {
        await request(app)
          .delete('/stores')
          .send({
            address: st.address,
          }).set({
            authorization: token,
          });
      }));
    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });
  });
});
