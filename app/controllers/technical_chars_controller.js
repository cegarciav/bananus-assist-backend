const { uuid } = require('uuidv4');
const { technical_char } = require('../models');

/**
 * @swagger
 * /chars:
 *  post:
 *    tags:
 *      - Technical Characteristics
 *    summary: new technical characteristic
 *    description: Allows to add a new technical characteristic to a given product
 *    operationId: chars.create
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
 *      '500':
 *        description: Internal server error
 */
async function create(req, res) {
  try {
    if (!req.body.key || !req.body.value || !req.body.productId) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
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
 * /chars:
 *  get:
 *    tags:
 *      - Technical Characteristics
 *    summary: list of technical characteristics
 *    description: Allows to retrieve a list of technical characteristics
 *    operationId: chars.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of technical characteristics retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function show_all(req, res) {
  try {
    const technical_chars = await technical_char.findAll();
    res.status(200).json(technical_chars);
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
 * /chars/show:
 *  post:
 *    tags:
 *      - Technical Characteristics
 *    summary: one technical characteristic
 *    description: Allows to retrieve one technical characteristic
 *    operationId: chars.show
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
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function show(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const technical_char_id = await technical_char.findOne({ where: { id: req.body.id } });
    if (!technical_char_id) {
      res.status(404).json({ state: 'F', error: "Technical characteristic doesn't exist" });
      return;
    }
    res.status(200).json(technical_char_id);
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
 * /chars:
 *  patch:
 *    tags:
 *      - Technical Characteristics
 *    summary: edit one technical characteristics
 *    description: Allows to modify one technical characteristics
 *    operationId: chars.modify
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
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(404).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      return;
    }
    await technical_char.update({
      key: req.body.key || current_char.key,
      value: req.body.value || current_char.value,
    }, { where: { id: req.body.id } });

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
 * /chars:
 *  delete:
 *    tags:
 *      - Technical Characteristics
 *    summary: delete one technical characteristics
 *    description: Allows to delete one technical characteristic
 *    operationId: chars.destroy
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
 *        description: Technical characteristic deleted successfully
 *      '400':
 *        description: Id not sent
 *      '404':
 *        description: Technical characteristic does not exist
 *      '500':
 *        description: Internal server error
 */
async function cdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(404).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      return;
    }

    await technical_char.destroy({
      where: {
        id: req.body.id,
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
  delete: cdelete,
};
