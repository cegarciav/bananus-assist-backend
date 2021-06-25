const { uuid } = require('uuidv4');
const { sale_point, store } = require('../models');

// CREATE
async function spcreate(req, res) {
  try {
    if (!req.body.storeId || !req.body.department) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_store = await store.findOne({ where: { id: req.body.storeId } });
    if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    const current_sale_point = await sale_point.findOne({where:{storeId: req.body.storeId, department: req.body.department}})
    if(current_sale_point){
      res.status(400).json({ state: 'F', error: 'Sale point already exist' });
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
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// READ ALL
async function spshow_all(req, res) {
  try {
    const sale_points = await sale_point.findAll();
    res.status(200).json(sale_points);
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
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
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// UPDATE
async function spupdate(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const sale_point_id = await sale_point.findOne({ where: { id: req.body.id } });
    if (!sale_point_id) {
      res.status(400).json({ state: 'F', error: "Sale point doesnt exist" });
      return;
    }
    const current_store = ((req.body.storeId) ? await store.findOne({ where: { id: req.body.storeId} }): true);
    if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }

    const store = ((req.body.storeId) ? req.body.storeId : sale_point_id.storeId);
    const depart = ((req.body.department) ? req.body.department : sale_point_id.department);
    const last_sale_point = sale_point.findAll({ where: { storeId:store, department : depart } });

    if(last_sale_point.length > 1){
      res.status(400).json({ state: 'F', error: 'Sale point already exist' });
      return;
    }

    await sale_point.update({
      storeId: ((req.body.storeId) ? req.body.storeId : sale_point_id.storeId),
      department: ((req.body.department) ? req.body.department : sale_point_id.department),
    }, { where: { id: sale_point_id.id } });

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
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

module.exports = {
  show_all: spshow_all,
  show_one: spshow,
  update : spupdate,
  create: spcreate,
  delete: spdelete,
};
