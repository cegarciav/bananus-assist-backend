const { available_payment_method } = require('../models');


async function add_product_payment_methods(req, res) {
  try {
    const { paymentMethodIds } = req.body;
    if (!paymentMethodIds || !Array.isArray(paymentMethodIds)) {
      res.status(400).json({ state: 'F', error: 'Missing required Payment Method IDs' });
      return;
    }

    const { productId } = req.params;

    for (payment_methodId of paymentMethodIds) {
      await available_payment_method.create({
        productId,
        payment_methodId,
      });
    }

    res.status(201).json({
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

async function update_product_payment_methods(req, res) {
  try {
    const { paymentMethodIdsToRemove, paymentMethodIdsToAdd } = req.body;
    if (
      (!paymentMethodIdsToRemove || !Array.isArray(paymentMethodIdsToRemove))
      && (!paymentMethodIdsToAdd || !Array.isArray(paymentMethodIdsToAdd))
    ) {
      res.status(400).json({ state: 'F', error: 'Invalid Fields' });
      return;
    }

    const { productId } = req.params;

    for (payment_methodId of paymentMethodIdsToRemove) {
      await available_payment_method.destroy({
        where: {
          productId,
          payment_methodId,
        },
      });
    }

    for (payment_methodId of paymentMethodIdsToAdd) {
      await available_payment_method.create({
        where: {
          productId,
          payment_methodId,
        },
      });
    }

    res.status(200).json({
      state: 'OK',
    });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  add_product_payment_methods,
  update_product_payment_methods,
};
