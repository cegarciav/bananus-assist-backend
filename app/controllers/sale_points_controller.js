const { uuid } = require('uuidv4');
const { sale_point, store } = require('../models');

// CREATE
async function spcreate(req, res) {
  try {
    if (!req.body.storeId || !req.body.department) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('sale_points_controller.js','You must send the id of a store and the department of the sale point to be able to create one', 'Invalid fields');
      return;
    }
    const current_store = await store.findOne({ where: { id: req.body.storeId } });
    if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to create a sale point in the store '${req.body.storeId}'`, 'Store doesnt exist');
      return;
    }
    const current_sale_point = await sale_point.findOne({where:{storeId: req.body.storeId, department: req.body.department}})
    if(current_sale_point){
      res.status(400).json({ state: 'F', error: 'Sale point already exist' });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to create a the sale point '${req.body.department}' in the store '${req.body.storeId}'`, 'Sale point already exist');
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
    req.app.locals.logger.debugLog('sale_points_controller.js',`Successfully create '${req.body.department}' sale point in the store '${req.body.storeId}'`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('sale_points_controller.js','Internal server error trying to create a sale point', e.parent.sqlMessage);
  }
}

// READ ALL
async function spshow_all(req, res) {
  try {
    const sale_points = await sale_point.findAll();
    req.app.locals.logger.debugLog('sale_points_controller.js','Successfully read all sale points from database');
    res.status(200).json(sale_points);
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('sale_points_controller.js','Internal server error trying to read all sale points', e.parent.sqlMessage);
  }
}

// READ ONE
async function spshow(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('sale_points_controller.js','You must send the id of the sale point to be able to read one', 'Invalid fields');
      return;
    }
    const sale_point_id = await sale_point.findOne({ where: { id: req.body.id } });

    if (!sale_point_id) {
      res.status(400).json({ state: 'F', error: "Sale point doesn't exist" });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to read a sale point with the id '${req.body.id}'`, "Sale point doesn't exist" );
      return;
    }
    res.status(200).json(sale_point_id);
    req.app.locals.logger.debugLog('sale_points_controller.js',`Successfully read '${req.body.id}' sale point from database`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('sale_points_controller.js','Internal server error trying to read a sale point', e.parent.sqlMessage);
  }
}

// UPDATE
async function spupdate(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('sale_points_controller.js','You must send the id of the sale point to be able to update one', 'Invalid fields');
      return;
    }
    const sale_point_id = await sale_point.findOne({ where: { id: req.body.id } });
    if (!sale_point_id) {
      res.status(400).json({ state: 'F', error: 'Sale point doesnt exist' });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to update the sale point '${req.body.id }'`, 'Sale point doesnt exist');
      return;
    }
    const current_store = ((req.body.storeId) ? await store.findOne({ where: { id: req.body.storeId} }): true);
    if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to update the sale point '${req.body.id }' of the store '${req.body.storeId}'`, 'Store doesnt exist');
      return;
    }

    const final_store = ((req.body.storeId) ? req.body.storeId : sale_point_id.storeId);
    const final_department = ((req.body.department) ? req.body.department : sale_point_id.department);
    const last_sale_point = await sale_point.findAll({ where: { storeId: final_store, department : final_department } });

    if(last_sale_point.length > 1 || (last_sale_point.length == 1 && last_sale_point[0].id !== sale_point_id.id)){
      res.status(400).json({ state: 'F', error: 'Sale point already exist' });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to update the sale point '${req.body.id }'`, 'Sale point already exist');
      return;
    }

    await sale_point.update({
      storeId: ((req.body.storeId) ? req.body.storeId : sale_point_id.storeId),
      department: ((req.body.department) ? req.body.department : sale_point_id.department),
    }, { where: { id: sale_point_id.id } });

    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog('sale_points_controller.js',`Successfully update '${req.body.id}' sale point`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('sale_points_controller.js','Internal server error trying to update a sale point', e.parent.sqlMessage);
  }
}

// DELETE
async function spdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('sale_points_controller.js','You must send the id of the sale point to be able to delete one', 'Invalid fields');
      return;
    }
    const curr_sale_point = await sale_point.findOne({ where: { id: req.body.id } });
    if (!curr_sale_point) {
      res.status(400).json({ state: 'F', error: "Sale's id doesn't exist" });
      req.app.locals.logger.warnLog('sale_points_controller.js',`Unable to delete a sale point with the id '${req.body.id}'`, "Sale point doesn't exist");
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
    req.app.locals.logger.debugLog('sale_points_controller.js',`Successfully delete '${req.body.id}' sale point from database`, 'Ok');
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('sale_points_controller.js','Internal server error trying to delete a sale point', e.parent.sqlMessage);
  }
}

module.exports = {
  show_all: spshow_all,
  show_one: spshow,
  update : spupdate,
  create: spcreate,
  delete: spdelete,
};
