const { uuid } = require('uuidv4');
const { sale_point } = require('../models');

// CREATE
async function spcreate(req, res) {
  try {
    if (!req.body.storeId) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    await sale_point.create({
      id: uuid(),
      storeId: req.body.storeId,
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// READ ALL
async function spshow_all(req, res) {
  try {
    const sale_points = await sale_point.findAll();
    res.status(200).json(sale_points);
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// READ ONE
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
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// DELETE
async function spdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_sale_point = await sale_point.findOne({ where: { id: req.body.id } });
    if (!curr_sale_point) {
      res.status(400).json({ state: 'F', error: "Sale's id doesn't exist" });
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
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

module.exports = {
  show_all: spshow_all,
  show_one: spshow,
  create: spcreate,
  delete: spdelete,
};
