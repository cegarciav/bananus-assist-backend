const { uuid } = require('uuidv4');
const {
  product,
  technical_char,
  available_payment_method,
  sequelize,
} = require('../models');

// CREATE
async function create(req, res) {
  let transaction;
  try {
    if (!req.body.name || !req.body.sku || !req.body.price || !req.body.image) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('product_controller.js','You must send the name, sku, price and image of the product to be able to create one', 'Invalid fields');
      return;
    }

    const last_product = await product.findOne({ where: { sku: req.body.sku } });

    if (last_product) {
      res.status(400).json({ state: 'F', error: 'That sku already exists' });
      req.app.locals.logger.warnLog('product_controller.js',`Unable to create a product with the sku '${req.body.sku}'`, 'That sku already exists');
      return;
    }

    transaction = await sequelize.transaction();

    const productId = uuid();
    await product.create({
      id: productId,
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      image: req.body.image,
    }, {
      transaction,
    });

    req.app.locals.logger.debugLog('product_controller.js',`Create payment methods of the product '${req.body.sku}' through a transaction`);
    
    if (req.body.paymentMethodIds) {
      const new_payment_methods = [...new Set(req.body.paymentMethodIds)]
        .map((methodId) => ({
          payment_methodId: methodId,
          productId,
        }));
      await available_payment_method.bulkCreate(new_payment_methods, {
        transaction,
      });
      req.app.locals.logger.debugLog('product_controller.js',`Successfully add '${req.body.paymentMethodIds}' payment methods to product '${req.body.name}'`);
    }

    await transaction.commit();
    
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog('product_controller.js',`Successfully create '${req.body.name}' product`, 'Ok');
    return;
  } catch (e) {
    await transaction.rollback();
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({
        state: 'F',
        error: 'Some of the payment methods sent are not valid',
      });
      req.app.locals.logger.warnLog('product_controller.js',`Unable add '${req.body.paymentMethodIds}' payment methods to product '${req.body.name}'. Product not created`,'Some of the payment methods sent are not valid' );
      return;
    }
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('product_controller.js','Internal server error trying to create a product', e.parent.sqlMessage);
  }
}

// READ ALL
async function show_all(req, res) {
  try {
    const products = await product.findAll({
      include: [{
        model: technical_char,
        attributes: ['id', 'key', 'value', 'productId'],
      }, {
        association: 'payment_methods',
        attributes: ['id', 'name'],
      }],
    });
    res.status(200).json(products);
    req.app.locals.logger.debugLog('product_controller.js','Successfully read all products from database');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('product_controller.js','Internal server error trying to read all products', e.parent.sqlMessage);
  }
}

// READ ONE
async function show(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('product_controller.js','You must send the sku of the product to be able to read one', 'Invalid fields');
      return;
    }

    const current_product = await product.findOne({
      where: { sku: req.body.sku },
      include: [{
        model: technical_char,
        attributes: ['id', 'key', 'value', 'productId'],
      }, {
        association: 'payment_methods',
        attributes: ['id', 'name'],
      }],
    });

    if (!current_product) {
      res.status(400).json({ state: 'F', error: "Product doesn't exist" });
      req.app.locals.logger.warnLog('product_controller.js',`Unable to read a product with the sku '${req.body.sku}'`, "Product doesn't exist");
      return;
    }
    res.status(200).json(current_product);
    req.app.locals.logger.debugLog('product_controller.js',`Successfully read '${req.body.sku}' product from database`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('product_controller.js','Internal server error trying to read a product', e.parent.sqlMessage);
  }
}

// UPDATE
async function update(req, res) {
  let transaction;
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('product_controller.js','You must send the sku of the product to be able to update one', 'Invalid fields');
      return;
    }
    if (req.body.new_sku) {
      const other_product = await product.findOne({ where: { sku: req.body.new_sku } });
      if (other_product) {
        res.status(400).json({ state: 'F', error: 'This sku already exists' });
        req.app.locals.logger.warnLog('product_controller.js',`Unable to update the sku of the product from '${req.body.sku}' to '${req.body.new_sku }'`, 'This sku already exists');
        return;
      }
    }
    const current_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!current_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesnt exist" });
      req.app.locals.logger.warnLog('product_controller.js',`Unable to update the product '${req.body.sku }'`, "Product's sku doesnt exist");
      return;
    }

    transaction = await sequelize.transaction();

    if (req.body.paymentMethodIds) {
      const new_payment_methods = [...new Set(req.body.paymentMethodIds)]
        .map((methodId) => ({
          payment_methodId: methodId,
          productId: current_product.id,
        }));

      await available_payment_method.destroy({
        where: {
          productId: current_product.id,
        },
        transaction,
      });
      await available_payment_method.bulkCreate(new_payment_methods, {
        transaction,
      });
      req.app.locals.logger.debugLog('product_controller.js',`Successfully add '${req.body.paymentMethodIds}' payment methods to product '${req.body.sku}'`);
    }

    await product.update({
      name: req.body.name || current_product.name,
      sku: req.body.new_sku || current_product.sku,
      price: req.body.price || current_product.price,
      image: req.body.image || current_product.image,
    }, {
      where: { sku: current_product.sku },
      transaction,
    });

    await transaction.commit();
    req.app.locals.logger.debugLog('product_controller.js',`Successfully update '${req.body.sku}' product`, 'Ok');
    res.status(200).json({ state: 'OK' });
    return;
  } catch (e) {
    await transaction.rollback();
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({
        state: 'F',
        error: 'Some of the payment methods sent are not valid',
      });
      req.app.locals.logger.warnLog('product_controller.js',`Unable add '${req.body.paymentMethodIds}' payment methods to product '${req.body.name}'. Product not updated`,'Some of the payment methods sent are not valid' );
      return;
    }
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('product_controller.js','Internal server error trying to update a product', e.parent.sqlMessage);
  }
}
// DELETE
async function pdelete(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('product_controller.js','You must send the sku of the product to be able to delete one', 'Invalid fields');
      return;
    }
    const curr_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!curr_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesn't exist" });
      req.app.locals.logger.warnLog('product_controller.js',`Unable to delete a product with the sku '${req.body.sku}'`, "Product's sku doesn't exist");
      return;
    }

    await product.destroy({
      where: {
        sku: req.body.sku,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog('product_controller.js',`Successfully delete '${req.body.sku}' product from database`, 'Ok');
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog('product_controller.js','Internal server error trying to delete a product', e.parent.sqlMessage);
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: pdelete,
};
