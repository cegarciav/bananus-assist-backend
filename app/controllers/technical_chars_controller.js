const { uuid } = require('uuidv4');
const { technical_char, product } = require('../models');

/**
 * @swagger
 * /chars:
 *  post:
 *    tags:
 *      - Technical Characteristics
 *    summary: new technical characteristic
 *    description: Allows to add a new technical characteristic to a given product
 *    operationId: chars.create
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - key
 *              - value
 *              - productId
 *            properties:
 *              key:
 *                type: string
 *              value:
 *                type: string
 *              productId:
 *                type: string
 *                format: uuidv4
 *                description: id of an existing product
 *    responses:
 *      '201':
 *        description: Technical characteristic created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function create(req, res) {
  try {
    if (!req.body.key || !req.body.value || !req.body.productId) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        'You must send the product id, key and value of the technical characteristic be able to create one',
        'Invalid fields',
      );
      return;
    }

    const last_product = await product.findOne({ where: { id: req.body.productId } });
    if (!last_product) {
      res.status(400).json({ state: 'F', error: "Product doesn't exist" });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        `Unable to create a technical characteristic for the product '${req.body.productId}'`,
        "Product doesn't exist",
      );
      return;
    }

    const last_tech_char = await technical_char.findOne({
      where: {
        key: req.body.key,
        value: req.body.value,
        productId: req.body.productId,
      },
    });

    if (last_tech_char) {
      res.status(400).json({ state: 'F', error: 'Technical characteristic of product already exist' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        'Unable to create a technical characteristic. Duplicate data',
        'Technical characteristic of product already exist',
      );
      return;
    }

    await technical_char.create({
      id: uuid(),
      key: req.body.key,
      value: req.body.value,
      productId: req.body.productId,
    });
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'technical_chars_controller.js',
      `Successfully create technical characteristic for the product '${req.body.productId}'`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'technical_chars_controller.js',
      'Internal server error trying to create a technical characteristic',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /chars:
 *  get:
 *    tags:
 *      - Technical Characteristics
 *    summary: list of technical characteristics
 *    description: Allows to retrieve a list of technical characteristics
 *    operationId: chars.list
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of technical characteristics retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
async function show_all(req, res) {
  try {
    const technical_chars = await technical_char.findAll();
    req.app.locals.logger.debugLog(
      'technical_chars_controller.js',
      'Successfully read all technical characteristics from database',
    );
    res.status(200).json(technical_chars);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'technical_chars_controller.js',
      'Internal server error trying to read all technical characteristics',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /chars/show:
 *  post:
 *    tags:
 *      - Technical Characteristics
 *    summary: one technical characteristic
 *    description: Allows to retrieve one technical characteristic
 *    operationId: chars.show
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: string
 *                format: uuidv4
 *    responses:
 *      '200':
 *        description: Information of the technical characteristic retrieved successfully
 *      '400':
 *        description: Id not sent
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function show(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        'You must send the id of the technical characteristic to be able to read one',
        'Invalid fields',
      );
      return;
    }
    const technical_char_id = await technical_char.findOne({ where: { id: req.body.id } });
    if (!technical_char_id) {
      res.status(404).json({ state: 'F', error: "Technical characteristic doesn't exist" });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        `Unable to read a technical characteristic with the id '${req.body.id}'`,
        "Technical characteristic doesn't exist",
      );
      return;
    }
    res.status(200).json(technical_char_id);
    req.app.locals.logger.debugLog(
      'technical_chars_controller.js',
      `Successfully read '${req.body.id}' technical characteristic from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'technical_chars_controller.js',
      'Internal server error trying to read a technical characteristic',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /chars:
 *  patch:
 *    tags:
 *      - Technical Characteristics
 *    summary: edit one technical characteristics
 *    description: Allows to modify one technical characteristics
 *    operationId: chars.modify
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: string
 *                format: uuidv4
 *              key:
 *                type: string
 *              value:
 *                type: string
 *    responses:
 *      '200':
 *        description: Technical characteristic updated successfully
 *      '400':
 *        description: Id not sent
 *      '403':
 *        description: You don't have the authorization to modify this resource
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        'You must send the id of the technical characteristic to be able to update one',
        'Invalid fields',
      );
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(404).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        `Unable to update the technical characteristic '${req.body.id}'`,
        "Technical characteristic doesn't exist",
      );
      return;
    }
    await technical_char.update({
      key: ((req.body.key) ? req.body.key : current_char.key),
      value: ((req.body.value) ? req.body.vale : current_char.value),
    }, { where: { id: req.body.id } });

    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog(
      'technical_chars_controller.js',
      `Successfully update '${req.body.id}' technical characteristic`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'technical_chars_controller.js',
      'Internal server error trying to update a technical characteristic',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /chars:
 *  delete:
 *    tags:
 *      - Technical Characteristics
 *    summary: delete one technical characteristics
 *    description: Allows to delete one technical characteristic
 *    operationId: chars.destroy
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: string
 *                format: uuidv4
 *    responses:
 *      '204':
 *        description: Technical characteristic deleted successfully
 *      '400':
 *        description: Id not sent
 *      '403':
 *        description: You don't have the authorization to delete this resource
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function cdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        'You must send the id of the technical characteristic to be able to delete one',
        'Invalid fields',
      );
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(404).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'technical_chars_controller.js',
        `Unable to delete a technical characteristic with the id '${req.body.id}'`,
        "Technical characteristic doesn't exist",
      );
      return;
    }

    await technical_char.destroy({
      where: {
        id: req.body.id,
      },
    });
    res.status(204).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'technical_chars_controller.js',
      `Successfully delete '${req.body.id}' technical characteristic from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'technical_chars_controller.js',
      'Internal server error trying to delete a technical characteristic',
      e.parent.sqlMessage,
    );
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: cdelete,
};
