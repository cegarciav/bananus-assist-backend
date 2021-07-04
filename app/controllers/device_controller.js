const { uuid } = require('uuidv4');
const { device, central_tablet } = require('../models');

// CREATE
async function screate(req, res) {
  try {
    if (!req.body.centralTabletId || !req.body.password || !req.body.serialNumber ) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('device_controller.js','You must send the id of a central tablet, the serial number and the password of the device to be able to create one', 'Invalid fields');
      return;
    }
    const last_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });
    const last_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (last_device || last_central_tablet) {
      res.status(400).json({ state: 'F', error: "There's another device or central tablet with the same serial number" });
      req.app.locals.logger.warnLog('device_controller.js',`Unable to create a device with the serial number '${req.body.serialNumber}'`, "There's another device or central tablet with the same serial number");
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
    req.app.locals.logger.debugLog('device_controller.js',`Successfully create '${req.body.serialNumber}' device`, 'Ok');
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog('device_controller.js','Internal server error trying to create a device', error.parent.sqlMessage);
  }
}

// READ ALL
async function sshow_all(req, res) {
  try {
    const devices = await device.findAll();
    res.status(200).json(devices);
    req.app.locals.logger.debugLog('device_controller.js','Successfully read all devices from database');
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog('device_controller.js','Internal server error trying to read all devices', error.parent.sqlMessage);
  }
}

// READ ONE
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('device_controller.js','You must send the serial number of the device to be able to read one', 'Invalid fields');
      return;
    }
    const current_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('device_controller.js',`Unable to read a device with the serial number'${req.body.serialNumber}'`, "Device serial number doesn't exist");
      return;
    }
    res.status(200).json(current_device);
    req.app.locals.logger.debugLog('device_controller.js',`Successfully read '${req.body.serialNumber}' device from database`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('device_controller.js','Internal server error trying to read a device', e.parent.sqlMessage);
  }
}

// UPDATE
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('device_controller.js','You must send the serial number of the device to be able to update one', 'Invalid fields');
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('device_controller.js',`Unable to update the device '${req.body.serialNumber }'`, "Device serial number doesn't exist");
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
        req.app.locals.logger.warnLog('device_controller.js',`Unable to update the serial number of the device from '${req.body.serialNumber}' to '${req.body.new_serialNumber}'`, 'This serial number already exist');
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
    req.app.locals.logger.debugLog('device_controller.js',`Successfully update '${req.body.serialNumber}' device`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('device_controller.js','Internal server error trying to update a device', e.parent.sqlMessage);
  }
}

// DELETE
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('device_controller.js','You must send the serial number of the device to be able to delete one', 'Invalid fields');
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('device_controller.js',`Unable to delete a device with the serial number '${req.body.serialNumber}'`, "Device serial number doesn't exist");
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
    req.app.locals.logger.debugLog('device_controller.js',`Successfully delete '${req.body.serialNumber}' device from database`, 'Ok');
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('device_controller.js','Internal server error trying to delete a device', e.parent.sqlMessage);
  }
}

module.exports = {
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
