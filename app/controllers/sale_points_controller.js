const { uuid } = require('uuidv4');
const { sale_point } = require('../models');

/**
 * @swagger
 * /sale-points:
 *  post:
 *    tags:
 *      - Sale Points
 *    summary: new sale point
 *    description: Allows to create a new sale point for a given store
 *    operationId: sale-points.create
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - department
 *              - storeId
 *            properties:
 *              department:
 *                type: string
 *              storeId:
 *                type: string
 *                description: if of an existing store
 *    responses:
 *      '201':
 *        description: Sale Point created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function spcreate(req, res) {
  try {
    if (!req.body.storeId || !req.body.department) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    await sale_point.create({
      id: uuid(),
      storeId: req.body.storeId,
      department: req.body.department,
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
 * /sale-points:
 *  get:
 *    tags:
 *      - Sale Points
 *    summary: list of sale points
 *    description: Allows to retrieve a list of sale points
 *    operationId: sale-points.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of sale points retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function spshow_all(req, res) {
  try {
    const sale_points = await sale_point.findAll();
    res.status(200).json(sale_points);
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
 * /sale-points/show:
 *  post:
 *    tags:
 *      - Sale Points
 *    summary: one sale point
 *    description: Allows to retrieve one sale point
 *    operationId: sale-points.show
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
 *        description: Information of the sale point retrieved successfully
 *      '400':
 *        description: Id not sent or sale point does not exist
 *      '500':
 *        description: Internal server error
 */
async function spshow(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const sale_point_id = await sale_point.findOne({ where: { id: req.body.id } });

    if (!sale_point_id) {
      res.status(400).json({ state: 'F', error: "Sale point doesn't exist" });
      return;
    }
    res.status(200).json(sale_point_id);
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
 * /sale-points:
 *  patch:
 *    tags:
 *      - Sale Points
 *    summary: edit one sale point
 *    description: Allows to modify one sale point
 *    operationId: sale-points.modify
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
 *              department:
 *                type: string
 *              storeId:
 *                type: string
 *                description: if of an existing store
 *    responses:
 *      '200':
 *        description: Sale point updated successfully
 *      '400':
 *        description: Id not sent or some of the fields sent are not valid
 *      '404':
 *        description: Sale point does not exist
 *      '500':
 *        description: Internal server error
 */
async function spupdate(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const sale_point_id = await sale_point.findOne({ where: { id: req.body.id } });
    if (!sale_point_id) {
      res.status(404).json({ state: 'F', error: 'Sale point doesnt exist' });
      return;
    }

    await sale_point.update({
      storeId: ((req.body.storeId) ? req.body.storeId : sale_point_id.storeId),
      department: ((req.body.department) ? req.body.department : sale_point_id.department),
    }, { where: { id: sale_point_id.id } });

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
 * /sale-points:
 *  delete:
 *    tags:
 *      - Sale Points
 *    summary: delete one sale point
 *    description: Allows to delete one sale point
 *    operationId: sale-points.destroy
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - id
 *            properties:
 *              email:
 *                type: string
 *                format: uuidv4
 *    responses:
 *      '200':
 *        description: Sale point deleted successfully
 *      '400':
 *        description: Id not sent
 *      '404':
 *        description: Sale point does not exist
 *      '500':
 *        description: Internal server error
 */
async function spdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_sale_point = await sale_point.findOne({ where: { id: req.body.id } });
    if (!curr_sale_point) {
      res.status(404).json({ state: 'F', error: "Sale's id doesn't exist" });
      return;
    }

    await sale_point.destroy({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  show_all: spshow_all,
  show_one: spshow,
  update: spupdate,
  create: spcreate,
  delete: spdelete,
};
