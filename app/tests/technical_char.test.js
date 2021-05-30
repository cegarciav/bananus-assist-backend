/* eslint-disable no-unused-expressions */
const request = require('supertest');
const app = require('../server');

let product = null;
let technicalChar = null;

describe('Technical Characteristic CRUD Testing', () => {
  beforeAll(async () => {
    // Create a new product to use its ID in the tests
    await request(app)
      .post('/products')
      .send({
        name: 'test_product',
        sku: 12345678,
        price: 10000,
        image: 'https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit',
      });

    const products = await request(app)
      .get('/products');

    [product] = products.body;

    // Create a technical char to use its ID in the tests
    await request(app)
      .post('/chars')
      .send({
        productId: product.id,
        key: 'some random key',
        value: 'some random value',
      });
    const technicalChars = await request(app)
      .get('/chars');
    [technicalChar] = technicalChars.body;
  });

  // CREATE
  it('should create a new technical char for a product', async () => {
    const res = await request(app)
      .post('/chars')
      .send({
        productId: product.id,
        key: 'some random new key',
        value: 'some random new value',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual('OK');
  });

  it('should fail creating a new technical char because productId is not provided', async () => {
    const res = await request(app)
      .post('/chars')
      .send({
        key: 'some random new key',
        value: 'some random new value',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail creating a new technical char because key is not provided', async () => {
    const res = await request(app)
      .post('/chars')
      .send({
        productId: product.id,
        value: 'some random new value',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  // READ ALL
  it('should read all technical chars', async () => {
    const res = await request(app)
      .get('/chars');
    expect(res.statusCode).toEqual(200);
  });

  // READ ONE
  it('should read one technical char', async () => {
    const res = await request(app)
      .post('/chars/show')
      .send({
        id: technicalChar.id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(technicalChar.id);
    expect(res.body.productId).toEqual(product.id);
    expect(res.body.key).toEqual('some random key');
  });

  it('should fail reading one technical char because id is not sent', async () => {
    const res = await request(app)
      .post('/chars/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail reading one technical char because id doesn\'t exist', async () => {
    const res = await request(app)
      .post('/chars/show')
      .send({
        id: 999999999,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Technical characteristic doesn't exist");
  });

  // UPDATE
  it('should fail updating the value because id is not sent', async () => {
    const res = await request(app)
      .patch('/chars')
      .send({
        value: 'some random new value for a technical characteristic',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail updating the value because id doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/chars')
      .send({
        id: 999999999,
        value: 'some random new value for a technical characteristic',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Technical characteristic doesn't exist");
  });

  it('should update the value of a technical characteristic', async () => {
    const res = await request(app)
      .patch('/chars')
      .send({
        id: technicalChar.id,
        value: 'some random new value for a technical characteristic',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  // DELETE
  it('should fail deleting a technical characteristic because id is not sent', async () => {
    const res = await request(app)
      .delete('/chars')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual('Invalid fields');
  });

  it('should fail deleting a technical characteristic because id doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/chars')
      .send({
        id: 999999999,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual('F');
    expect(res.body.error).toEqual("Technical characteristic doesn't exist");
  });

  it('should delete a technical characteristic', async () => {
    const res = await request(app)
      .delete('/chars')
      .send({
        id: technicalChar.id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('OK');
  });

  afterAll(async () => {
    // Delete all technical characteristics created
    const technicalChars = await request(app)
      .get('/chars');

    technicalChars.body.forEach(async (tChar) => {
      await request(app)
        .delete('/chars')
        .send({
          id: tChar.id,
        });
    });

    // Delete product created
    await request(app)
      .delete('/products')
      .send({
        sku: 12345678,
      });
  });
});
