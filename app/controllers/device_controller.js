const { uuid } = require('uuidv4');
const { device, central_tablet } = require('../models');

/**
 * @swagger
 * /devices:
 *  post:
 *    tags:
 *      - Devices
 *    summary: new device
 *    description: Allows to create a new device
 *    operationId: devices.create
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - centralTabletId
 *              - serialNumber
 *              - password
 *            properties:
 *              centralTabletId:
 *                type: string
 *                format: uuidv4
 *                description: id of an existing central tablet
 *              serialNumber:
 *                type: string
 *                unique: true
 *              password:
 *                type: string
 *    responses:
 *      '201':
 *        description: Device created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function screate(req, res) {
  try {
    if (!req.body.centralTabletId || !req.body.password || !req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        'You must send the id of a central tablet, the serial number and the password of the device to be able to create one',
        'Invalid fields',
      );
      return;
    }
    const current_central = await central_tablet.findOne({
      where: { id: req.body.centralTabletId },
    });
    if (!current_central) {
      req.app.locals.logger.warnLog(
        'device_controller.js',
        `Unable to create a device with the central tablet '${req.body.centralTabletId}'`,
        'Invalid central tablet id',
      );
      res.status(400).json({ state: 'F', error: 'Invalid central tablet id' });
      return;
    }
    const last_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });
    const last_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (last_device || last_central_tablet) {
      res.status(400).json({ state: 'F', error: "There's another device or central tablet with the same serial number" });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        `Unable to create a device with the serial number '${req.body.serialNumber}'`,
        "There's another device or central tablet with the same serial number",
      );
      return;
    }
    await device.create({
      id: uuid(),
      serialNumber: req.body.serialNumber,
      central_tabletId: req.body.centralTabletId,
      password: req.body.password,
    });
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'device_controller.js',
      `Successfully create '${req.body.serialNumber}' device`,
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
      'device_controller.js',
      'Internal server error trying to create a device',
      error.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /devices:
 *  get:
 *    tags:
 *      - Devices
 *    summary: list of devices
 *    description: Allows to retrieve a list of devices
 *    operationId: devices.list
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of devices retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
async function sshow_all(req, res) {
  try {
    const devices = await device.findAll();
    res.status(200).json(devices);
    req.app.locals.logger.debugLog(
      'device_controller.js',
      'Successfully read all devices from database',
    );
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog(
      'device_controller.js',
      'Internal server error trying to read all devices',
      error.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /devices/show:
 *  post:
 *    tags:
 *      - Devices
 *    summary: one device
 *    description: Allows to retrieve one device
 *    operationId: devices.show
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
 *        description: Information of the device retrieved successfully
 *      '400':
 *        description: Serial Number not sent
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        'You must send the serial number of the device to be able to read one',
        'Invalid fields',
      );
      return;
    }
    const current_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        `Unable to read a device with the serial number'${req.body.serialNumber}'`,
        "Device serial number doesn't exist",
      );
      return;
    }
    res.status(200).json(current_device);
    req.app.locals.logger.debugLog(
      'device_controller.js',
      `Successfully read '${req.body.serialNumber}' device from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'device_controller.js',
      'Internal server error trying to read a device',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /devices:
 *  patch:
 *    tags:
 *      - Devices
 *    summary: edit one device
 *    description: Allows to modify one device
 *    operationId: devices.modify
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
 *              centralTabletId:
 *                type: string
 *                format: uuidv4
 *              serialNumber:
 *                type: string
 *                unique: true
 *              new_serialNumber:
 *                type: string
 *                unique: true
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: device updated successfully
 *      '400':
 *        description: Serial Number not sent or some of the fields sent are not valid
 *      '403':
 *        description: You don't have the authorization to modify this resource
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        'You must send the serial number of the device to be able to update one',
        'Invalid fields',
      );
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        `Unable to update the device '${req.body.serialNumber}'`,
        "Device serial number doesn't exist",
      );
      return;
    }

    if (req.body.new_serialNumber) {
      const last_device = await device.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      const last_central_tablet = await central_tablet.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      if (last_device || last_central_tablet) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        req.app.locals.logger.warnLog(
          'device_controller.js',
          `Unable to update the serial number of the device from '${req.body.serialNumber}' to '${req.body.new_serialNumber}'`,
          'This serial number already exist',
        );
        return;
      }
    }

    if (req.body.centralTabletId) {
      const current_central = await central_tablet.findOne({
        where: { id: req.body.centralTabletId },
      });
      if (!current_central) {
        req.app.locals.logger.warnLog(
          'device_controller.js',
          `Unable to update the device ${req.body.serialNumber} with the new central tablet '${req.body.centralTabletId}'`,
          'Invalid central tablet id',
        );
        res.status(400).json({ state: 'F', error: 'Invalid central tablet id' });
        return;
      }
    }

    await device.update({
      serialNumber: req.body.new_serialNumber || current_device.serialNumber,
      central_tabletId: req.body.centralTabletId || current_device.central_tabletId,
      password: req.body.password || current_device.password,
    }, {
      where: { serialNumber: req.body.serialNumber },
      individualHooks: true,
    });

    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog(
      'device_controller.js',
      `Successfully update '${req.body.serialNumber}' device`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'device_controller.js',
      'Internal server error trying to update a device',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /devices:
 *  delete:
 *    tags:
 *      - Devices
 *    summary: delete one device
 *    description: Allows to delete one device
 *    operationId: devices.destroy
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
 *        description: Device deleted successfully
 *      '400':
 *        description: Serial Number not sent
 *      '403':
 *        description: You don't have the authorization to delete this resource
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        'You must send the serial number of the device to be able to delete one',
        'Invalid fields',
      );
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog(
        'device_controller.js',
        `Unable to delete a device with the serial number '${req.body.serialNumber}'`,
        "Device serial number doesn't exist",
      );
      return;
    }
    await device.destroy({
      where: {
        serialNumber: req.body.serialNumber,
      },
    });
    res.status(204).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'device_controller.js',
      `Successfully delete '${req.body.serialNumber}' device from database`,
      'Ok',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'device_controller.js',
      'Internal server error trying to delete a device',
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
