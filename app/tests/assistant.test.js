/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let administrator = null;
let supervisor = null;
let assistant = null;
let store = null;

describe('Assistant Testing', () => {
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

  it('should fail assign store and assistant not provided', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail assign store not provided', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: assistant,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail assign assistant not provided', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail assign store doesnt exists', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: assistant,
        address: 'Not an address',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should fail assign user doesnt exists', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: 'notreal@email.cl',
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("User's email doesnt exist");
  });

  it('should fail assign an administrator to a store as assistant', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: administrator,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be an assistant');
  });

  it('should fail assign a supervisor to a store as assistant', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: supervisor,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be an assistant');
  });

  it('should assign an assistant to the store', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: assistant,
        address: store,
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should fail assign an assistant to the same store twice', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: assistant,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User is already assistant in the store');
  });
  
  it('should fail unassign store and user not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Invalid fields' );
  });

  it('should fail unassign user not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Invalid fields' );
  });

  it('should fail unassign store not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Invalid fields' );
  });

  it('should fail unassign user not exists', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: 'notreal@email.cl',
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("User's email doesnt exist" );
  });

  it('should fail unassign store not exists', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: 'Not an address',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should unassign store  assitant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: store,
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should fail unassign store user is not an assitant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: store,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('User is not a store assistant' );
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
        address: 'Fake Street 123',
      });
  });

});