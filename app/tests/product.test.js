const request = require('supertest');
const { uuid } = require('uuidv4');
const app = require('../server');
const { user } = require('../models');

describe('Product CRUD Testing', () => {
  let paymentMethod;
  let token;
  beforeAll(async () => {
    const res = await request(app)
      .post('/payment-methods')
      .send({
        name: 'Credit card',
      });
    paymentMethod = res.body.paymentMethod;
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
  // CREATE
  it('should fail creating fields not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating name is not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        sku: 12345678,
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating sku is not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating price is not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating image is not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        price: 10000,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a product because the payment methods created are not valid', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
        paymentMethodIds: ['66db6603-ec5c-4eef-85c2-748a315931a1'],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Some of the payment methods sent are not valid');
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
        paymentMethodIds: [paymentMethod.id],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail creating a new product because sku already exists', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('That sku already exists');
  });

  // READ ALL

  it('should read all products', async () => {
    const res = await request(app)
      .get('/products');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE

  it('should fail reading one product because sku is not sent', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one product because sku doesn\'t exist', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({
        sku: 123,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Product doesn't exist");
  });

  it('should read one product', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({
        sku: 12345678,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.sku).toEqual(12345678);
    expect(res.body.name).toEqual('test_product');
  });

  // UPDATE
  it('should fail updating the price because sku is not sent', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        price: 20000,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating sku because it already exist', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        new_sku: 12345678,
        sku: 12345678,
        price: 20000,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('This sku already exists');
  });

  it('should fail updating price because sku doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        sku: 123,
        price: 20000,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Product's sku doesnt exist");
  });

  it('should update the price of one product', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        price: 20000,
        sku: 12345678,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail updating payment methods because some ids are not valid', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        sku: 12345678,
        paymentMethodIds: ['66db6603-ec5c-4eef-85c2-748a315931a1', paymentMethod.id],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Some of the payment methods sent are not valid');
  });

  it('should update the payment methods of one product', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        paymentMethodIds: [paymentMethod.id],
        sku: 12345678,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  // DELETE
  it('should fail deleting one product because sku is not sent', async () => {
    const res = await request(app)
      .delete('/products')
      .send({}).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting one product because sku doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 123,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Product's sku doesn't exist");
  });

  it('should delete one product', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 12345678,
      }).set({
        authorization: token,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    await request(app)
      .delete('/payment-methods')
      .send({
        name: 'Credit card',
      }).set({
        authorization: token,
      });
    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });
  });
});
