const { uuid } = require('uuidv4');
const { product } = require('../models');

/**
 * @swagger
 * /products:
 *  post:
 *    tags:
 *      - Products
 *    summary: new product
 *    description: Allows to create a new product
 *    operationId: product.create
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *              - sku
 *              - price
 *              - image
 *            properties:
 *              name:
 *                type: string
 *              sku:
 *                type: integer
 *                unique: true
 *              price:
 *                type: integer
 *                minimum: 0
 *              image:
 *                type: string
 *                format: url
 *    responses:
 *      '201':
 *        description: Product created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function create(req, res) {
  try {
    if (!req.body.name || !req.body.sku || !req.body.price || !req.body.image) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const last_product = await product.findOne({ where: { sku: req.body.sku } });

    if (last_product) {
      res.status(400).json({ state: 'F', error: 'That sku already exists' });
      return;
    }

    await product.create({
      id: uuid(),
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      image: req.body.image,
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /products:
 *  get:
 *    tags:
 *      - Products
 *    summary: list of products
 *    description: Allows to retrieve a list of products
 *    operationId: products.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of products retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function show_all(req, res) {
  try {
    const products = await product.findAll();
    res.status(200).json(products);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /products/show:
 *  post:
 *    tags:
 *      - Products
 *    summary: one product
 *    description: Allows to retrieve one product
 *    operationId: products.show
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - sku
 *            properties:
 *              sku:
 *                type: integer
 *                unique: true
 *    responses:
 *      '200':
 *        description: Information of the product retrieved successfully
 *      '400':
 *        description: Sku not sent
 *      '404':
 *        description: Product does not exist
 *      '500':
 *        description: Internal server error
 */
async function show(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_product = await product.findOne({ where: { sku: req.body.sku } });

    if (!current_product) {
      res.status(404).json({ state: 'F', error: "Product doesn't exist" });
      return;
    }
    res.status(200).json(current_product);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /products:
 *  patch:
 *    tags:
 *      - Products
 *    summary: edit one product
 *    description: Allows to modify one product
 *    operationId: products.modify
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - sku
 *            properties:
 *              name:
 *                type: string
 *              sku:
 *                type: integer
 *                unique: true
 *              price:
 *                type: integer
 *                minimum: 0
 *              image:
 *                type: string
 *                format: url
 *    responses:
 *      '200':
 *        description: product updated successfully
 *      '400':
 *        description: Sku not sent or some of the fields sent are not valid
 *      '404':
 *        description: Product does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    if (req.body.new_sku) {
      const other_product = await product.findOne({ where: { sku: req.body.new_sku } });
      if (other_product) {
        res.status(400).json({ state: 'F', error: 'This sku already exists' });
        return;
      }
    }
    const current_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!current_product) {
      res.status(404).json({ state: 'F', error: "Product's sku doesnt exist" });
      return;
    }

    await product.update({
      name: ((req.body.name) ? req.body.name : current_product.name),
      sku: ((req.body.new_sku) ? req.body.new_sku : current_product.sku),
      price: ((req.body.price) ? req.body.price : current_product.price),
      image: ((req.body.image) ? req.body.image : current_product.image),
    }, { where: { sku: current_product.sku } });

    res.status(200).json({ state: 'OK' });
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /products:
 *  delete:
 *    tags:
 *      - Products
 *    summary: delete one product
 *    description: Allows to delete one product
 *    operationId: products.destroy
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - sku
 *            properties:
 *              sku:
 *                type: integer
 *                unique: true
 *    responses:
 *      '200':
 *        description: Product deleted successfully
 *      '400':
 *        description: Sku not sent
 *      '404':
 *        description: Product does not exist
 *      '500':
 *        description: Internal server error
 */
async function pdelete(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!curr_product) {
      res.status(404).json({ state: 'F', error: "Product's sku doesn't exist" });
      return;
    }

    await product.destroy({
      where: {
        sku: req.body.sku,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: pdelete,
};
