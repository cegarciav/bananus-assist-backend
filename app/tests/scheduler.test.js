const request = require('supertest');
const app = require('../server');
const sinon = require('sinon');

describe('Sale Point CRUD Testing', () => {
  afterEach(() => {
      sinon.restore();
  })
  // CREATE
  it('it should execute the scheduler with Fake Timer', async () => {
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  

  
});
