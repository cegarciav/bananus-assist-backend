const request = require('supertest');
const app = require('../server');

describe('payment method CRUD Testing', () => {
  // CREATE
  describe('payment method CREATE validaions', () => {
    beforeAll(async () => {
      await request(app)
        .post('/payment-methods')
        .send({
          name: 'Credit card',
        });
    });
    let paymentMethod;
    it('should fail creating a payment method because name is not provided', async () => {
      const res = await request(app)
        .post('/payment-methods')
        .send({
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual('Invalid fields');
    });
    it('should fail creating a payment method because name already exists', async () => {
      const res = await request(app)
        .post('/payment-methods')
        .send({
          name: 'credit card',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual('Payment method already exists');
    });
    it('should create a payment method successfully', async () => {
      const res = await request(app)
        .post('/payment-methods')
        .send({
          name: 'cash',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.state).toEqual('OK');
      paymentMethod = res.body.paymentMethod;
      expect(paymentMethod.name).toEqual('cash');
    });
  });

  // READ
  describe('payment method READ validaions', () => {
    // READ ALL
    it('should read all payment methods', async () => {
      const res = await request(app)
        .get('/payment-methods');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      const methodNames = res.body.map((method) => method.name);
      expect(methodNames).toContain('cash');
      expect(methodNames).toContain('Credit card');
    });

    // READ ONE
    it('should fail reading one payment method because name is not sent', async () => {
      const res = await request(app)
        .post('/payment-methods/show')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual('Invalid fields');
    });
    it('should fail reading one payment method because its name does not exist', async () => {
      const res = await request(app)
        .post('/payment-methods/show')
        .send({ name: 'random name' });
      expect(res.statusCode).toEqual(404);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual("Payment method doesn't exist");
    });
    it('should read one payment method', async () => {
      const res = await request(app)
        .post('/payment-methods/show')
        .send({ name: 'cash' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toContain('cash');
    });
  });

  // DELETE
  describe('payment method DELETE validaions', () => {
    it('should fail deleting a payment method because name is not sent', async () => {
      const res = await request(app)
        .delete('/payment-methods')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual('Invalid fields');
    });
    it('should fail deleting one payment method because its name does not exist', async () => {
      const res = await request(app)
        .delete('/payment-methods')
        .send({ name: 'random name' });
      expect(res.statusCode).toEqual(404);
      expect(res.body.state).toEqual('F');
      expect(res.body.error).toEqual("Payment method doesn't exist");
    });
    it('should delete one payment method', async () => {
      const res = await request(app)
        .delete('/payment-methods')
        .send({ name: 'cash' });
      expect(res.statusCode).toEqual(204);
    });
  });

  afterAll(async () => {
    await request(app)
      .delete('/payment-methods')
      .send({
        name: 'Credit card',
      });
  });
});
