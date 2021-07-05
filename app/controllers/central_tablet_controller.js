const { uuid } = require('uuidv4');
const { central_tablet, device, sale_point } = require('../models');

// CREATE
async function screate(req, res) {
  try {
    if (!req.body.salePointId || !req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('central_tablet_controller.js','You must send the id of a sale point, the serial number and the password of the central tablet to be able to create one', 'Invalid fields');
      return;
    }
    let current_sale_point = await sale_point.findOne({where: {id: req.body.salePointId}})
    if(!current_sale_point){
      return res.status(400).json({ state: 'F', error: "Invalid sale point id" });
    }
    const last_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    const last_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });
    if (last_central_tablet || last_device) {
      res.status(400).json({ state: 'F', error: "There's another central tablet or device with the same serial number" });
      req.app.locals.logger.warnLog('central_tablet_controller.js',`Unable to create a central tablet with the serial number '${req.body.serialNumber}'`, "There's another central tablet or device with the same serial number");
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
    req.app.locals.logger.debugLog('central_tablet_controller.js',`Successfully create '${req.body.serialNumber}' central tablet`, 'Ok');
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog('central_tablet_controller.js','Internal server error trying to create a central tablet', error.parent.sqlMessage);
  }
}

// READ ALL
async function sshow_all(req, res) {
  try {
    const central_tablets = await central_tablet.findAll();
    res.status(200).json(central_tablets);
    req.app.locals.logger.debugLog('central_tablet_controller.js','Successfully read all central tablets from database');
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
      message: error,
    });
    req.app.locals.logger.errorLog('central_tablet_controller.js','Internal server error trying to read all central tablets', error.parent.sqlMessage);
  }
}

// READ ONE
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('central_tablet_controller.js','You must send the serial number of the central tablet to be able to read one', 'Invalid fields');
      return;
    }
    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('central_tablet_controller.js',`Unable to read a central tablet with the serial number'${req.body.serialNumber}'`, "Central tablet serial number doesn't exist");
      return;
    }
    res.status(200).json(current_central_tablet);
    req.app.locals.logger.debugLog('central_tablet_controller.js',`Successfully read '${req.body.serialNumber}' central tablet from database`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('central_tablet_controller.js','Internal server error trying to read a central tablet', e.parent.sqlMessage);
  }
}

// UPDATE
async function update(req, res) {
  try {
    if(req.body.salePointId){
      let current_sale_point = await sale_point.findOne({where: {id: req.body.salePointId}})
      if(!current_sale_point){
      return res.status(400).json({ state: 'F', error: "Invalid sale point id" });
      }
    }
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('central_tablet_controller.js','You must send the serial number of the central tablet to be able to update one', 'Invalid fields');
      return;
    }

    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('central_tablet_controller.js',`Unable to update the central tablet '${req.body.serialNumber }'`, "Central tablet serial number doesn't exist");
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
        req.app.locals.logger.warnLog('central_tablet_controller.js',`Unable to update the serial number of the central tablet from '${req.body.serialNumber}' to '${req.body.new_serialNumber}'`, 'This serial number already exist');
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
    req.app.locals.logger.debugLog('central_tablet_controller.js',`Successfully update '${req.body.serialNumber}' central tablet`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('central_tablet_controller.js','Internal server error trying to update a central tablet', e.parent.sqlMessage);
  }
}

// DELETE
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('central_tablet_controller.js','You must send the serial number of the central tablet to be able to delete one', 'Invalid fields');
      return;
    }

    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      req.app.locals.logger.warnLog('central_tablet_controller.js',`Unable to delete a central tablet with the serial number '${req.body.serialNumber}'`, "Central tablet serial number doesn't exist");
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
    req.app.locals.logger.debugLog('central_tablet_controller.js',`Successfully delete '${req.body.serialNumber}' central tablet from database`, 'Ok');
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('central_tablet_controller.js','Internal server error trying to delete a central tablet', e.parent.sqlMessage);
  }
}

module.exports = {
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
