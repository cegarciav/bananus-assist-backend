const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

let administrator = null;
let supervisor = null;
let assistant = null;
let store = null;

let token;

describe('Assistant Testing', () => {
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
    // Create a new user administrador to use in the tests
    await request(app)
      .post('/users')
      .send({
        name: 'Super Admin',
        email: 'admin@test.cl',
        rol: 'administrator',
      }).set({
        authorization: token,
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
        authorization: token,
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
        authorization: token,
      });

    assistant = 'assist@test.cl';

    // Create a new store to use its ID in the tests
    await request(app)
      .post('/stores')
      .send({
        name: 'The Store',
        address: 'Fake Street 123',
      }).set({
        authorization: token,
      });

    store = 'Fake Street 123';
  });

  // CREATE

  it('should fail assign store and assistant not provided', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
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
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should fail assign an assistant to the same store twice', async () => {
    const res = await request(app)
      .post('/assistants')
      .send({
        email: assistant,
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User is already assistant in the store');
  });

  // DELETE

  it('should fail unassign store and user not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail unassign user not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail unassign store not provided', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail unassign user not exists', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: 'notreal@email.cl',
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("User's email doesnt exist");
  });

  it('should fail unassign store not exists', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: 'Not an address',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Store doesnt exist');
  });

  it('should fail unassign assign an administrator to a store as assistant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: administrator,
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be an assistant');
  });

  it('should fail unassign assign an supervisor to a store as assistant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: supervisor,
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User must be an assistant');
  });

  it('should unassign store  assitant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should fail unassign store user is not an assitant', async () => {
    const res = await request(app)
      .delete('/assistants')
      .send({
        email: assistant,
        address: store,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User is not a store assistant');
  });

  afterAll(async () => {
    // Delete all users created
    const users = await request(app)
      .get('/users').set({
        authorization: token,
      });

    await Promise.all(users.body
      .map(async (u) => {
        await request(app)
          .delete('/users')
          .send({
            email: u.email,
          }).set({
            authorization: token,
          });
      }));

    // Delete store created
    await request(app)
      .delete('/stores')
      .send({
        address: 'Fake Street 123',
      }).set({
        authorization: token,
      });
  });
});
