const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

describe('Session endpoints testing', () => {
  let token;
  let token2;
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

    await request(app)
      .post('/users')
      .send({
        name: 'test',
        email: 'test01@test.cl',
      }).set({
        authorization: token,
      });
    await request(app)
      .patch('/users')
      .send({
        email: 'test01@test.cl',
        password: '1233',
      }).set({
        authorization: token,
      });
  });

  // CREATE
  it('should fail in create a new session because fields is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({

      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session because the email is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session because the password is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test0@test.cl',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in create a new session wrong credentials', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test0@test.cl',
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid email or password');
  });

  it('should create a new session', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test01@test.cl',
        password: '1233',
      });
    expect(res4.statusCode).toEqual(200);
    expect(res4.body.token).toBeTruthy();
    token2 = res4.body.token;
  });

  it('should fail in create a new session user already log in', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test01@test.cl',
        password: '1233',
      })
      .set('authorization', token2);
    expect(res4.statusCode).toEqual(403);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('You must be unlogged to do this');
  });

  // DELETE
  it('should fail in delete session user not log in', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send();
    expect(res5.statusCode).toEqual(401);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('You must be logged to do this');
  });

  it('should fail in delete session because token attribute is not a token', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('token', 'no soy un jwt');
    expect(res5.statusCode).toEqual(401);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('You must be logged to do this');
  });

  it('should fail delete session because user is not a device', async () => {
    const res5 = await request(app)
      .delete('/sessions/devices')
      .send()
      .set('authorization', token2);
    expect(res5.statusCode).toEqual(403);
    expect(res5.body.state).toEqual('F');
    expect(res5.body.error).toEqual('Only devices or tablets can do this action');
  });

  it('should delete session', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('authorization', token2);
    expect(res5.statusCode).toEqual(204);
  });

  afterAll(async () => {
    await request(app)
      .delete('/users')
      .send({ email: 'test01@test.cl' }).set({
        authorization: token,
      });
    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });
  });
});
