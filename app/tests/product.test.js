const request = require('supertest')
const app = require('../server')

describe('Product CRUD Testing', () => {
    
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
  }),
  it('should fail creating a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: "test_product",
        sku: 12345678,
        price: 10000,
        image: "https://www.lapolar.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1c04210e/images/large/23019272.jpg?sw=1200&sh=1200&sm=fit"
      });
    expect(res.statusCode).toEqual(400);
  }),
  it('should read all products', async () => {
    const res = await request(app)
      .get('/products');
      
    expect(res.statusCode).toEqual(200);
  }),
  it('should read one product', async () => {
    const res = await request(app)
      .get('/products/show')
      .send({
        sku: 12345678,
      });
    expect(res.statusCode).toEqual(200);
  }),
  it('should fail reading one product', async () => {
    const res = await request(app)
      .get('/products/show')
      .send({});
    expect(res.statusCode).toEqual(400);
  }),
  it('should update the price of one product', async () => {
    const res = await request(app)
      .patch('/products')
      .send({
        price: 20000,
        sku: 12345678
      });
    expect(res.statusCode).toEqual(200);
  }),
  it('should fail deleting one product', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 123
      })
    expect(res.statusCode).toEqual(400)
  }),
  it('should delete one product', async () => {
    const res = await request(app)
      .delete('/products')
      .send({
        sku: 12345678
      })
    expect(res.statusCode).toEqual(200)
  })
})
