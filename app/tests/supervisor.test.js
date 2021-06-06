/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let administrator = null;
let supervisor = null;
let assistant = null;
let store = null;

describe('User Supervisor Testing', () => {
  beforeAll(async () => {
    // Create a new user administrador to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Super Admin',
        email: 'admin@test.cl',
        password: 'test',
        rol: 'administrator'
      });

      administrator = 'admin@test.cl';

    // Create a new user supervisor to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Supervisor',
        email: 'super@test.cl',
        password: 'test',
        rol: 'supervisor'
      });

    supervisor = 'super@test.cl';

    // Create a new user assistant to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Assistant',
        email: 'assist@test.cl',
        password: 'test',
        rol: 'assistant',
      });

    assistant = 'assist@test.cl'; 

    // Create a new store to use its ID in the tests
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      });

    store = 'Fake Street 123';
  });

  //CREATE USER WITH STORE

  it('should fail create administrator with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Administrador',
        email: 'new_admin@test.cl',
        password: 'test',
        rol: 'administrator',
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store' );
  });

  it('should fail create assistant with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Asistente',
        email: 'new_assistant@test.cl',
        password: 'test',
        rol: 'assistant',
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store' );
  });

  it('should create supervisor with store', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nuevo Supervisor',
        email: 'new_supervisor@test.cl',
        password: 'test',
        rol: 'supervisor',
        address: store,
      });
    expect(res.statusCode).toEqual(201);
  });

  //UPDATE USER WITH STORE

  it('should fail update the store of the administrator', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: administrator,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store' );
  });

  it('should fail update the store of the assistant', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: assistant,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be a supervisor to be able to assign a store' );
  });

  it('should fail update the store of the supervisor because address doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: supervisor,
        address: 'Not an address',
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
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should update the store of the administrator if we change the rol to supervisor', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: administrator,
        address: store,
        rol: 'supervisor',
      });
    expect(res.statusCode).toEqual(200);
  });


  afterAll(async () => {
    // Delete all users created
    const users = await request(app)
      .get('/users');

    users.body.forEach(async (u) => {
      await request(app)
        .delete('/users')
        .send({
          email: u.email,
        });
    });

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: store,
      });

  });
});
