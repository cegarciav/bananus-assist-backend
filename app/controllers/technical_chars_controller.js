const { uuid } = require('uuidv4');
const { technical_char, product } = require('../models');

// CREATE
async function create(req, res) {
  try {
    if (!req.body.key || !req.body.value || !req.body.productId) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('technical_chars_controller.js','You must send the product id, key and value of the technical characteristic be able to create one', 'Invalid fields');
      return;
    }

    const last_product = await product.findOne({ where: { id: req.body.productId } });
    if (!last_product) {
      res.status(400).json({ state: 'F', error: "Product doesn\'t exist" });
      req.app.locals.logger.warnLog('technical_chars_controller.js',`Unable to create a technical characteristic for the product '${req.body.productId}'`, "Product doesn't exist");
      return;
    }

    const last_tech_char = await technical_char.findOne({ where: {
      key: req.body.key,
      value: req.body.value,
      productId: req.body.productId
    }});

    if(last_tech_char){
      res.status(400).json({ state: 'F', error: 'Technical characteristic of product already exist' });
      req.app.locals.logger.warnLog('technical_chars_controller.js',`Unable to create a technical characteristic. Duplicate data`, 'Technical characteristic of product already exist');
      return;
    }

    await technical_char.create({
      id: uuid(),
      key: req.body.key,
      value: req.body.value,
      productId: req.body.productId,
    });
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog('technical_chars_controller.js',`Successfully create technical characteristic for the product '${req.body.productId}'`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('technical_chars_controller.js','Internal server error trying to create a technical characteristic', e.parent.sqlMessage);
  }
}

// READ ALL
async function show_all(req, res) {
  try {
    const technical_chars = await technical_char.findAll();
    req.app.locals.logger.debugLog('technical_chars_controller.js','Successfully read all technical characteristics from database');
    res.status(200).json(technical_chars);
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('technical_chars_controller.js','Internal server error trying to read all technical characteristics', e.parent.sqlMessage);
  }
}

// READ ONE
async function show(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('technical_chars_controller.js','You must send the id of the technical characteristic to be able to read one', 'Invalid fields');
      return;
    }
    const technical_char_id = await technical_char.findOne({ where: { id: req.body.id } });
    if (!technical_char_id) {
      res.status(400).json({ state: 'F', error: "Technical characteristic doesn't exist" });
      req.app.locals.logger.warnLog('technical_chars_controller.js',`Unable to read a technical characteristic with the id '${req.body.id}'`, "Technical characteristic doesn't exist" );
      return;
    }
    res.status(200).json(technical_char_id);
    req.app.locals.logger.debugLog('technical_chars_controller.js',`Successfully read '${req.body.id}' technical characteristic from database`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('technical_chars_controller.js','Internal server error trying to read a technical characteristic', e.parent.sqlMessage);
  }
}

// UPDATE
async function update(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('technical_chars_controller.js','You must send the id of the technical characteristic to be able to update one', 'Invalid fields');
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(400).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      req.app.locals.logger.warnLog('technical_chars_controller.js',`Unable to update the technical characteristic '${req.body.id }'`, "Technical characteristic doesn't exist");
      return;
    }
    await technical_char.update({
      key: ((req.body.key) ? req.body.key : current_char.key),
      value: ((req.body.value) ? req.body.vale : current_char.value),
    }, { where: { id: req.body.id } });

    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog('technical_chars_controller.js',`Successfully update '${req.body.id}' technical characteristic`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('technical_chars_controller.js','Internal server error trying to update a technical characteristic', e.parent.sqlMessage);
  }
}

// DELETE
async function cdelete(req, res) {
  try {
    if (!req.body.id) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('technical_chars_controller.js','You must send the id of the technical characteristic to be able to delete one', 'Invalid fields');
      return;
    }
    const current_char = await technical_char.findOne({ where: { id: req.body.id } });
    if (!current_char) {
      res.status(400).json({ state: 'F', error: 'Technical characteristic doesn\'t exist' });
      req.app.locals.logger.warnLog('technical_chars_controller.js',`Unable to delete a technical characteristic with the id '${req.body.id}'`, "Technical characteristic doesn't exist");
      return;
    }

    await technical_char.destroy({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog('technical_chars_controller.js',`Successfully delete '${req.body.id}' technical characteristic from database`, 'Ok');
    return;
  } catch (e){
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    req.app.locals.logger.errorLog('technical_chars_controller.js','Internal server error trying to delete a technical characteristic', e.parent.sqlMessage);
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: cdelete,
};
