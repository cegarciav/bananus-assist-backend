const { uuid } = require('uuidv4');
const { central_tablet, device, sale_point } = require('../models');

/**
 * @swagger
 * /central-tablets:
 *  post:
 *    tags:
 *      - Central Tablets
 *    summary: new central tablet
 *    description: Allows to create a new central tablet
 *    operationId: central-tablets.create
 *    security:
 *      - apiKey: []
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
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function screate(req, res) {
  try {
    if (!req.body.salePointId || !req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        'You must send the id of a sale point, the serial number and the password of the central tablet to be able to create one',
        'Invalid fields',
      );
      return;
    }
    const current_sale_point = await sale_point.findOne({
      where: { id: req.body.salePointId },
    });
    if (!current_sale_point) {
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        `Unable to create a central tablet in the sale point '${req.body.salePointId}'`,
        'Invalid sale point id',
      );
      res.status(400).json({ state: 'F', error: 'Invalid sale point id' });
      return;
    }
    const last_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    const last_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });
    if (last_central_tablet || last_device) {
      res.status(400).json({ state: 'F', error: "There's another central tablet or device with the same serial number" });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        `Unable to create a central tablet with the serial number '${req.body.serialNumber}'`,
        "There's another central tablet or device with the same serial number",
      );
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
    req.app.locals.logger.debugLog(
      'central_tablet_controller.js',
      `Successfully create '${req.body.serialNumber}' central tablet`,
      'Ok',
    );
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog(
      'central_tablet_controller.js',
      'Internal server error trying to create a central tablet',
      error.parent.sqlMessage,
    );
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
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of central-tablets retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
async function sshow_all(req, res) {
  try {
    const central_tablets = await central_tablet.findAll();
    res.status(200).json(central_tablets);
    req.app.locals.logger.debugLog(
      'central_tablet_controller.js',
      'Successfully read all central tablets from database',
    );
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog(
      'central_tablet_controller.js',
      'Internal server error trying to read all central tablets',
      error.parent.sqlMessage,
    );
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
 *    security:
 *      - apiKey: []
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
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        'You must send the serial number of the central tablet to be able to read one',
        'Invalid fields',
      );
      return;
    }
    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        `Unable to read a central tablet with the serial number'${req.body.serialNumber}'`,
        "Central tablet serial number doesn't exist",
      );
      return;
    }
    res.status(200).json(current_central_tablet);
    req.app.locals.logger.debugLog(
      'central_tablet_controller.js',
      `Successfully read '${req.body.serialNumber}' central tablet from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'central_tablet_controller.js',
      'Internal server error trying to read a central tablet',
      e.parent.sqlMessage,
    );
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
 *    security:
 *      - apiKey: []
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
 *      '403':
 *        description: You don't have the authorization to modify this resource
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        'You must send the serial number of the central tablet to be able to update one',
        'Invalid fields',
      );
      return;
    }
    if (req.body.salePointId) {
      const current_sale_point = await sale_point.findOne({
        where: { id: req.body.salePointId },
      });
      if (!current_sale_point) {
        req.app.locals.logger.warnLog(
          'central_tablet_controller.js',
          `Unable to update the central tablet '${req.body.serialNumber}' to the sale point ${req.body.salePointId}`,
          'Invalid sale point id',
        );
        res.status(400).json({ state: 'F', error: 'Invalid sale point id' });
        return;
      }
    }
    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        `Unable to update the central tablet '${req.body.serialNumber}'`,
        "Central tablet serial number doesn't exist",
      );
      return;
    }

    if (req.body.new_serialNumber) {
      const last_central_tablet = await central_tablet.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      const last_device = await device.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      if (last_central_tablet || last_device) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        req.app.locals.logger.warnLog(
          'central_tablet_controller.js',
          `Unable to update the serial number of the central tablet from '${req.body.serialNumber}' to '${req.body.new_serialNumber}'`,
          'This serial number already exist',
        );
        return;
      }
    }

    await central_tablet.update({
      serialNumber: req.body.new_serialNumber || current_central_tablet.serialNumber,
      sale_pointId: req.body.salePointId || current_central_tablet.sale_pointId,
      password: req.body.password || current_central_tablet.password,
    }, {
      where: { serialNumber: req.body.serialNumber },
      individualHooks: true,
    });

    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog(
      'central_tablet_controller.js',
      `Successfully update '${req.body.serialNumber}' central tablet`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'central_tablet_controller.js',
      'Internal server error trying to update a central tablet',
      e.parent.sqlMessage,
    );
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
 *    security:
 *      - apiKey: []
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
 *      '204':
 *        description: Central tablet deleted successfully
 *      '400':
 *        description: Serial Number not sent
 *      '403':
 *        description: You don't have the authorization to delete this resource
 *      '404':
 *        description: Central tablet does not exist
 *      '500':
 *        description: Internal server error
 */
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        'You must send the serial number of the central tablet to be able to delete one',
        'Invalid fields',
      );
      return;
    }

    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(404).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'central_tablet_controller.js',
        `Unable to delete a central tablet with the serial number '${req.body.serialNumber}'`,
        "Central tablet serial number doesn't exist",
      );
      return;
    }
    await central_tablet.destroy({
      where: {
        serialNumber: req.body.serialNumber,
      },
    });
    res.status(204).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'central_tablet_controller.js',
      `Successfully delete '${req.body.serialNumber}' central tablet from database`,
      'Ok',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'central_tablet_controller.js',
      'Internal server error trying to delete a central tablet',
      e.parent.sqlMessage,
    );
  }
}

module.exports = {
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
