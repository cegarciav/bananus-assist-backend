const { uuid } = require('uuidv4');
const { central_tablet } = require('../models');

/**
 * @swagger
 * /central-tablets:
 *  post:
 *    tags:
 *      - Central Tablets
 *    summary: new central tablet
 *    description: Allows to create a new central tablet
 *    operationId: central-tablets.create
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *              - password
 *              - salePointId
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *              password:
 *                type: string
 *              salePointId:
 *                type: string
 *                format: uuidv4
 *                description: id of an existing sale point
 *    responses:
 *      '201':
 *        description: Central tablet created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function screate(req, res) {
  try {
    if (!req.body.salePointId || !req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const last_central_tablet = await central_tablet.findOne({
      where: {
        serialNumber: req.body.serialNumber,
      },
    });
    if (last_central_tablet) {
      res.status(400).json({ state: 'F', error: "There's another central tablet with the same serial number" });
      return;
    }

    await central_tablet.create({
      id: uuid(),
      serialNumber: req.body.serialNumber,
      sale_pointId: req.body.salePointId,
      password: req.body.password,
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
  }
}

/**
 * @swagger
 * /central-tablets:
 *  get:
 *    tags:
 *      - Central Tablets
 *    summary: list of central tablets
 *    description: Allows to retrieve a list of central tablets
 *    operationId: central-tablets.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of central-tablets retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function sshow_all(req, res) {
  try {
    const central_tablets = await central_tablet.findAll();
    res.status(200).json(central_tablets);
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
  }
}

/**
 * @swagger
 * /central-tablet/show:
 *  post:
 *    tags:
 *      - Central Tablets
 *    summary: one central tablet
 *    description: Allows to retrieve one central tablet
 *    operationId: central-tablets.show
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Information of the central tablet retrieved successfully
 *      '400':
 *        description: Serial Number not sent
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      return;
    }
    res.status(200).json(current_central_tablet);
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
 * /central-tablets:
 *  patch:
 *    tags:
 *      - Central Tablets
 *    summary: edit one central tablet
 *    description: Allows to modify one central tablet
 *    operationId: central-tablets.modify
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *              new_serialNumber:
 *                type: string
 *                unique: true
 *              password:
 *                type: string
 *              salePointId:
 *                type: string
 *                format: uuidv4
 *                description: id of an existing sale point
 *    responses:
 *      '200':
 *        description: Central tablet updated successfully
 *      '400':
 *        description: Serial Number not sent or some of the fields sent are not valid
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      return;
    }

    if (req.body.new_serialNumber) {
      const last_central_tablet = await central_tablet.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      if (last_central_tablet) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        return;
      }
    }

    await central_tablet.update({
      serialNumber: req.body.new_serialNumber || current_central_tablet.serialNumber,
      sale_pointId: req.body.salePointId || current_central_tablet.sale_pointId,
      password: req.body.password || current_central_tablet.password,
    }, {
      where: { serialNumber: req.body.serialNumber },
    });

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
 * /central-tablets:
 *  delete:
 *    tags:
 *      - Central Tablets
 *    summary: delete one central tablet
 *    description: Allows to delete one central tablet
 *    operationId: central-tablets.destroy
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Central tablet deleted successfully
 *      '400':
 *        description: Serial Number not sent
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      return;
    }
    await central_tablet.destroy({
      where: {
        serialNumber: req.body.serialNumber,
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
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
