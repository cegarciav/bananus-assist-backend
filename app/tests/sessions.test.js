/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

describe('Session endpoints testing', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'test',
        email: 'test01@test.cl',
      }).then(()=>{
        request(app)
        .patch('/users')
        .send({
          email: 'test01@test.cl',
          password: '1233',
        });
      });
  });

  // FAIL CREATE
  it('should fail in create a new session', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test0@test.cl',
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
  });
  it('should fail in create a new session because the email is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        password: '1233',
      });
    expect(res4.statusCode).toEqual(400);
  });
  it('should fail in create a new session because the password is not sent', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test0@test.cl',
      });
    expect(res4.statusCode).toEqual(400);
  });
  // CREATE
  it('should create a new session', async () => {
    const res4 = await request(app)
      .post('/sessions')
      .send({
        email: 'test01@test.cl',
        password: '1233',
      });
    expect(res4.statusCode).toEqual(200);
    expect(res4.body.token).toBeTruthy();
    token = res4.body.token;
  });
  // FAIL DELETE
  it('should fail in delete session', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send();
    expect(res5.statusCode).toEqual(400);
  });
  // FAIL DELETE
  it('should fail in delete session because token attribute is not a token', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('token', 'no soy un jwt');
    expect(res5.statusCode).toEqual(400);
  });
  // DELETE
  it('should delete session', async () => {
    const res5 = await request(app)
      .delete('/sessions')
      .send()
      .set('token', token);
    expect(res5.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await request(app)
      .delete('/users')
      .send({ email: 'test01@test.cl' });
  });
});
