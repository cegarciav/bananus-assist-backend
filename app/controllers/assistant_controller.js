const { assistant, user, store } = require('../models');

// CREATE
async function ascreate(req, res) {
  try {
    if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    let current_assistant = null;

    if (current_user && current_store) {
      current_assistant = await assistant.findOne({
        where: {
          userId: current_user.id,
          storeId: current_store.id,
        },
      });
    }

    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      return;
    }
    if (current_user.rol !== 'assistant') {
      res.status(400).json({ state: 'F', error: 'User must be an assistant' });
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    if (current_assistant) {
      res.status(400).json({ state: 'F', error: 'User is already assistant in the store' });
      return;
    }
    await assistant.create({
      storeId: current_store.id,
      userId: current_user.id,
    });
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

// DELETE
async function asdelete(req, res) {
  try {
    if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    let current_assistant = null;

    if (current_user && current_store) {
      current_assistant = await assistant.findOne({
        where: {
          userId: current_user.id,
          storeId: current_store.id,
        },
      });
    }

    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      return;
    }
    if (current_user.rol !== 'assistant') {
      res.status(400).json({ state: 'F', error: 'User must be an assistant' });
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    if (!current_assistant) {
      res.status(400).json({ state: 'F', error: 'User is not a store assistant' });
      return;
    }
    await assistant.destroy({
      where: {
        userId: current_user.id,
        storeId: current_store.id,
      },
    });
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
  create: ascreate,
  delete: asdelete,
};
