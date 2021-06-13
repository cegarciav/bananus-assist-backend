const { uuid } = require('uuidv4');
const { central_tablet } = require('../models');

// CREATE
async function screate(req, res) {
  try {
    if (!req.body.salePointId ||!req.body.serialNumber ) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const last_central_tablet = await central_tablet.findOne({ where: { serialNumber: req.body.serialNumber } });
    if (last_central_tablet) {
      res.status(400).json({ state: 'F', error: "There's another central tablet with the same serial number" });
      return;
    }

    await central_tablet.create({
      id: uuid(),
      serialNumber: req.body.serialNumber,
      sale_pointId: req.body.salePointId,
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
    const central_tablets = await central_tablet.findAll();
    res.status(200).json(central_tablets);
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
    const current_central_tablet = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber }
    });
    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      return;
    }
    res.status(200).json(current_central_tablet);
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

    const current_central_tablet = await central_tablet.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
      return;
    }

    if (req.body.new_serialNumber) {
      const last_central_tablet = await central_tablet.findOne({ where: { serialNumber: req.body.new_serialNumber } });
      if (last_central_tablet) {
        res.status(400).json({ state: 'F', error: 'This serial number already exist' });
        return;
      }
    }

    await central_tablet.update({
      serialNumber: ((req.body.new_serialNumber) ? req.body.new_serialNumber : current_central_tablet.serialNumber),
      sale_pointId: ((req.body.salePointId) ? req.body.salePointId : current_central_tablet.sale_pointId),
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

    const current_central_tablet = await central_tablet.findOne({ where: { serialNumber: req.body.serialNumber } });

    if (!current_central_tablet) {
      res.status(400).json({ state: 'F', error: 'Central tablet serial number doesn\'t exist' });
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
