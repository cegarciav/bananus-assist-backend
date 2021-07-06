/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');
const {user} = require('../models');
const { uuid } = require('uuidv4');

let centralTablet = null;
let salePoint = null;
let store = null;
let token;

describe('Central Tablet CRUD Testing', () => {
  beforeAll(async () => {
    // Create a store point to use its ID in the tests
    await user.create({
      id: uuid(),
      name: "admin",
      password:"123",
      email: "admin@hotmail.cl",
      rol: "administrator"
    });

    let login = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@hotmail.cl',
        password: '123',
      });

    token = login.body.token

    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      }).set({
        'authorization': token
      });

    const stores = await request(app)
      .get('/stores').set({
        'authorization': token
      });

    [store] = stores.body;

    // Create a central tablet to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department in Central Tablet',
      }).set({
        'authorization': token
      });
    const salePoints = await request(app)
      .get('/sale-points').set({
        'authorization': token
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
        'authorization': token
      });
    const centralTablets = await request(app)
      .get('/central-tablets').set({
        'authorization': token
      });
    [centralTablet] = centralTablets.body;
  });

  // CREATE
  it('should fail creating a central tablet because fields not provided', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a central tablet because salePointId is not provided', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        serialNumber: '100102312-2139124',
        password: '12345',
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
        password: '12345',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a central tablet because password is not provided', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        serialNumber: '100102312-2139124',
        salePointId: salePoint.id,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a central tablet because sale point doesnt exist  in database', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        serialNumber: '100102312-2139124',
        salePointId: 'FAKE',
        password: '12345',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid sale point id');
  });

  it('should create a new central tablet', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139124',
        password: '12345',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail create a new central tablet because serial number already in use', async () => {
    const res = await request(app)
      .post('/central-tablets')
      .send({
        salePointId: salePoint.id,
        serialNumber: '100102312-2139124',
        password: '12345',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("There's another central tablet or device with the same serial number");
  });

  // READ ALL

  it('should read all central tablets', async () => {
    const res = await request(app)
      .get('/central-tablets');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE

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
    expect(res.body.error).toEqual("Central tablet serial number doesn't exist");
  });

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

  // UPDATE

  it('should fail updating  because serialNumber is not sent', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating  because serialNumber not exist', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
        serialNumber: '99999999999',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Central tablet serial number doesn\'t exist');
  });

  it('should fail updating  because serialNumber already in use', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
        serialNumber: centralTablet.serialNumber,
        new_serialNumber: centralTablet.serialNumber,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('This serial number already exist');
  });

  it('should update the serialNumber of one central tablet', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
        serialNumber: centralTablet.serialNumber,
        new_serialNumber: '100102312-2139120',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail updating  because sale point associated doesnt exist in database', async () => {
    const res = await request(app)
      .patch('/central-tablets')
      .send({
        serialNumber: '100102312-2139120',
        new_serialNumber: centralTablet.serialNumber,
        salePointId: 'FAKE',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid sale point id');
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
    expect(res.body.error).toEqual("Central tablet serial number doesn't exist");
  });

  it('should delete one central tablet', async () => {
    const res = await request(app)
      .delete('/central-tablets')
      .send({
        serialNumber: '100102312-2139124',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all central tablets created
    const centralTablets = await request(app)
      .get('/central-tablets').set({
        'authorization': token
      });

    await Promise.all(centralTablets.body
      .map(async (sp) => {
        await request(app)
          .delete('/central-tablets')
          .send({
            serialNumber: sp.serialNumber,
          }).set({
            'authorization': token
          });
      }));

    // Delete sale_point created
    await request(app)
      .delete('/sale-points')
      .send({
        id: salePoint.id,
      }).set({
        'authorization': token
      });

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store.address,
      }).set({
        'authorization': token
      });
    await user.destroy({where:{email: 'admin@hotmail.cl'}})
  });
});
