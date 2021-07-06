//* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');
const {user} = require('../models');
const { uuid } = require('uuidv4');

let store = null;
let salePoint = null;
let token;

describe('Sale Point CRUD Testing', () => {
  beforeAll(async () => {
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

    // Create a new store to use its ID in the tests
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

    // Create a sale point to use its ID in the tests
    await request(app)
      .post('/sale-points')
      .send({
        storeId: store.id,
        department: 'Some Department',
      }).set({
        'authorization': token
      });
    const salePoints = await request(app)
      .get('/sale-points').set({
        'authorization': token
      });
    [salePoint] = salePoints.body;
  });

  // CREATE

  it('should fail creating a sale point because fields not provided', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({}).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a sale point because storeId is not provided', async () => {
    const res = await request(app)
      .post('/sale-points')
      .send({
        department: 'Another Department',
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Sale point already exist');
  });

  // READ ALL
  it('should read all sale points', async () => {
    const res = await request(app)
      .get('/sale-points').set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE
  it('should fail reading one sale point because id is not sent', async () => {
    const res = await request(app)
      .post('/sale-points/show')
      .send({}).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one sale point because id doesn\'t exist', async () => {
    const res = await request(app)
      .post('/sale-points/show')
      .send({
        id: 99999999999,
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(200);
  });

  // DELETE
  it('should fail deleting one sale point because id is not sent', async () => {
    const res = await request(app)
      .delete('/sale-points')
      .send({}).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one sale point because id doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/sale-points')
      .send({
        id: 99999999999,
      }).set({
        'authorization': token
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
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all sale points created
    const salePoints = await request(app)
      .get('/sale-points').set({
        'authorization': token
      });

    await Promise.all(salePoints.body
      .map(async (sp) => {
        await request(app)
          .delete('/sale-points')
          .send({
            id: sp.id,
          }).set({
            'authorization': token
          });
      }));

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
