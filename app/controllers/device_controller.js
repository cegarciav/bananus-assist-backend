const { uuid } = require('uuidv4');
const { device } = require('../models');

/**
 * @swagger
 * /devices:
 *  post:
 *    tags:
 *      - Devices
 *    summary: new device
 *    description: Allows to create a new device
 *    operationId: devices.create
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
 *      '500':
 *        description: Internal server error
 */
async function screate(req, res) {
  try {
    if (!req.body.centralTabletId || !req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const last_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });
    if (last_device) {
      res.status(400).json({ state: 'F', error: "There's another device with the same serial number" });
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
 * /devices:
 *  get:
 *    tags:
 *      - Devices
 *    summary: list of devices
 *    description: Allows to retrieve a list of devices
 *    operationId: devices.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of devices retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function sshow_all(req, res) {
  try {
    const devices = await device.findAll();
    res.status(200).json(devices);
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
 * /devices/show:
 *  post:
 *    tags:
 *      - Devices
 *    summary: one device
 *    description: Allows to retrieve one device
 *    operationId: devices.show
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
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      return;
    }
    res.status(200).json(current_device);
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
 * /devices:
 *  patch:
 *    tags:
 *      - Devices
 *    summary: edit one device
 *    description: Allows to modify one device
 *    operationId: devices.modify
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
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      return;
    }

    if (req.body.new_serialNumber) {
      const last_device = await device.findOne({
        where: { serialNumber: req.body.new_serialNumber },
      });
      if (last_device) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        return;
      }
    }

    await device.update({
      serialNumber: req.body.new_serialNumber || current_device.serialNumber,
      central_tabletId: req.body.centralTabletId || current_device.central_tabletId,
      password: req.body.password || current_device.password,
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
 * /devices:
 *  delete:
 *    tags:
 *      - Devices
 *    summary: delete one device
 *    description: Allows to delete one device
 *    operationId: devices.destroy
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
 *        description: Device deleted successfully
 *      '400':
 *        description: Serial Number not sent
 *      '404':
 *        description: Device does not exist
 *      '500':
 *        description: Internal server error
 */
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(404).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      return;
    }
    await device.destroy({
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
