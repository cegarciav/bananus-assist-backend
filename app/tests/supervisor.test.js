/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');
const {user} = require('../models');
const { uuid } = require('uuidv4');

let administrator = null;
let supervisor = null;
let assistant = null;
let store = null;
let token;

describe('User Supervisor Testing', () => {
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
    // Create a new user administrador to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Super Admin',
        email: 'admin@test.cl',
        rol: 'administrator',
      }).set({
        'authorization': token
      });

    administrator = 'admin@test.cl';

    // Create a new user supervisor to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Supervisor',
        email: 'super@test.cl',
        rol: 'supervisor',
      }).set({
        'authorization': token
      });

    supervisor = 'super@test.cl';

    // Create a new user assistant to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Assistant',
        email: 'assist@test.cl',
        rol: 'assistant',
      }).set({
        'authorization': token
      });

    assistant = 'assist@test.cl';

    // Create a new store to use its ID in the tests
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      }).set({
        'authorization': token
      });

    store = 'Fake Street 123';
  });

  // CREATE USER WITH STORE

  it('should fail create administrator with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Administrador',
        email: 'new_admin@test.cl',
        rol: 'administrator',
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store');
  });

  it('should fail create assistant with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Asistente',
        email: 'new_assistant@test.cl',
        rol: 'assistant',
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store');
  });

  it('should fail create supervisor because store not exist', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Supervisor',
        email: 'new_supervisor@test.cl',
        rol: 'supervisor',
        address: 'Not an address',
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should create supervisor with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Supervisor',
        email: 'new_supervisor@test.cl',
        rol: 'supervisor',
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  // UPDATE USER WITH STORE

  it('should fail update the store of the administrator', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: administrator,
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store');
  });

  it('should fail update the store of the assistant', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: assistant,
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store');
  });

  it('should fail update the store of the supervisor because address doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: supervisor,
        address: 'Not an address',
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should update the store of the supervisor', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: supervisor,
        address: store,
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should update the store of the administrator if we change the rol to assistant', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: administrator,
        address: store,
        rol: 'assistant',
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store');
  });

  it('should update the store of the administrator if we change the rol to supervisor', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: administrator,
        address: store,
        rol: 'supervisor',
      }).set({
        'authorization': token
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all users created
    const users = await request(app)
      .get('/users').set({
        'authorization': token
      });

    await Promise.all(users.body
      .map(async (u) => {
        await request(app)
          .delete('/users')
          .send({
            email: u.email,
          }).set({
            'authorization': token
          });
      }));

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store,
      }).set({
        'authorization': token
      });
    await user.destroy({where:{email: 'admin@hotmail.cl'}})
  });
});
