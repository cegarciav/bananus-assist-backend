const request = require('supertest')
const app = require('../server')

describe('Product CRUD Testing', () => {

  //CREATE
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: "test_product",
        sku: 12345678,
        price: 10000,
        image: "https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.state).toEqual("OK");
  }),

  it('should fail creating sku is not provided', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: "test_product",
        price: 10000,
        image: "https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Invalid fields");
  }),

  it('should fail creating a new product because sku already exists', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: "test_product",
        sku: 12345678,
        price: 10000,
        image: "https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("That sku already exists");
  }),

  //READ ALL
  it('should read all products', async () => {
    const res = await request(app)
      .get('/products');
    expect(res.statusCode).toEqual(200);
  }),

  //READ ONE
  it('should read one product', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({
        sku: 12345678,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.sku).toEqual(12345678);
    expect(res.body.name).toEqual("test_product");
  }),

  it('should fail reading one product because sku is not sent', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Invalid fields");
  }),

  it('should fail reading one product because sku doesn\'t exist', async () => {
    const res = await request(app)
      .post('/products/show')
      .send({
          sku: 123
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Product doesn't exist");
  }),

  //UPDATE
  it('should fail updating the price because sku is not sent', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        price: 20000
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Invalid fields");
  }),

  it('should fail updating sku because it already exist', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        new_sku: 12345678,
        sku: 12345678,
        price: 20000
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("This sku already exists");
  }),

  it('should fail updating price because sku doesn\'t exist', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        sku: 123,
        price: 20000
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Product's sku doesnt exist");
  }),

  it('should update the price of one product', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        price: 20000,
        sku: 12345678
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual("OK");
  }),

  //DELETE
  it('should fail deleting one product because sku is not sent', async () => {
    const res = await request(app)
      .delete('/products')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Invalid fields");
  }),

  it('should fail deleting one product because sku doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 123
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.state).toEqual("F");
    expect(res.body.error).toEqual("Product's sku doesn't exist");
  }),

  it('should delete one product', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 12345678
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual("OK");
  })
})