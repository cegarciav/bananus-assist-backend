const { uuid } = require('uuidv4');
const { device } = require('../models');

// CREATE
async function screate(req, res) {
  try {
    if (!req.body.centralTabletId ||!req.body.serialNumber || !req.body.password) {
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
      password: req.body.password
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch(error){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
      message: error
    });
  }
}

// READ ALL
async function sshow_all(req, res) {
  try {
    const devices = await device.findAll();
    res.status(200).json(devices);
    return;
  } catch(error){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
      message: error
    });
  }
}

// READ ONE
async function sshow(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber }
    });
    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      return;
    }
    res.status(200).json(current_device);
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// UPDATE
async function update(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
      return;
    }

    if (req.body.new_serialNumber) {
      const last_device = await device.findOne({ where: { serialNumber: req.body.new_serialNumber } });
      if (last_device) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        return;
      }
    }

    await device.update({
      serialNumber: ((req.body.new_serialNumber) ? req.body.new_serialNumber : current_device.serialNumber),
      central_tabletId: ((req.body.centralTabletId) ? req.body.centralTabletId : current_device.central_tabletId),
      password: ((req.body.password) ? req.body.password : current_device.password)
    }, { where: { serialNumber: req.body.serialNumber } });

    res.status(200).json({ state: 'OK' });
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// DELETE
async function sdelete(req, res) {
  try {
    if (!req.body.serialNumber) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_device = await device.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_device) {
      res.status(400).json({ state: 'F', error: 'Device serial number doesn\'t exist' });
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
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
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