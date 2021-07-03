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
      return;
    }

    const last_product = await product.findOne({ where: { sku: req.body.sku } });

    if (last_product) {
      res.status(400).json({ state: 'F', error: 'That sku already exists' });
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

    if (req.body.paymentMethodIds) {
      const new_payment_methods = [...new Set(req.body.paymentMethodIds)]
        .map((methodId) => ({
          payment_methodId: methodId,
          productId,
        }));
      await available_payment_method.bulkCreate(new_payment_methods, {
        transaction,
      });
    }

    await transaction.commit();
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch (e) {
    await transaction.rollback();
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({
        state: 'F',
        error: 'Some of the payment methods sent are not valid',
      });
      return;
    }
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
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
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

// READ ONE
async function show(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
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
      return;
    }
    res.status(200).json(current_product);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

// UPDATE
async function update(req, res) {
  let transaction;
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    if (req.body.new_sku) {
      const other_product = await product.findOne({ where: { sku: req.body.new_sku } });
      if (other_product) {
        res.status(400).json({ state: 'F', error: 'This sku already exists' });
        return;
      }
    }
    const current_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!current_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesnt exist" });
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
    res.status(200).json({ state: 'OK' });
    return;
  } catch (e) {
    await transaction.rollback();
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({
        state: 'F',
        error: 'Some of the payment methods sent are not valid',
      });
      return;
    }
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}
// DELETE
async function pdelete(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!curr_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesn't exist" });
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
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: pdelete,
};
