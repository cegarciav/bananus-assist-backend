const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

let token;

describe('User CRUD Testing', () => {
  // CREATE
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
  });

  it('should fail create a new user because email and name not send', async () => {
    const res = await request(app)
      .post('/users')
      .send().set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail create a new user because email not send', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'test',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail create a new user because name not send', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'test',
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail create a new user because email already in use', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'test2',
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Email already in use');
  });

  // READ ALL

  it('should read all users', async () => {
    const res = await request(app)
      .get('/users').set({
        authorization: token,
      });

    expect(res.statusCode).toEqual(200);
  });

  // READ ONE

  it('should fail read user because email not send', async () => {
    const res = await request(app)
      .post('/users/show')
      .send({}).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail read user because email not exists', async () => {
    const res = await request(app)
      .post('/users/show')
      .send({
        email: 'notanemail@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User email doesnt exist');
  });

  it('should read one user', async () => {
    const res = await request(app)
      .post('/users/show')
      .send({
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('test');
  });

  // UPDATE

  it('should fail update user email not send', async () => {
    const res = await request(app)
      .patch('/users')
      .send().set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail update user email not exist', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: 'notanemail@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("User's email doesnt exist");
  });

  it('should fail update user email already in use', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: 'test01@test.cl',
        new_email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('New email already in use');
  });

  it('should update the email of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        new_email: 'testupdate@test.cl',
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should update the name of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        name: 'update',
        email: 'testupdate@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should update the password of one user', async () => {
    const res = await request(app)
      .patch('/users')
      .send({
        email: 'testupdate@test.cl',
        password: 'update',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  // DELETE

  it('should fail delete user because email not send', async () => {
    const res = await request(app)
      .delete('/users')
      .send({}).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail delete user because email not exist', async () => {
    const res = await request(app)
      .delete('/users')
      .send({
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('User email doesnt exist');
  });

  it('should delete one user', async () => {
    const res = await request(app)
      .delete('/users')
      .send({
        email: 'testupdate@test.cl',
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(204);
  });

  afterAll(async () => {
    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });
  });
});
