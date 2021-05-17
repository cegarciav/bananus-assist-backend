const { uuid } = require('uuidv4');
const { store } = require('../models');

// CREATE
async function screate(req, res) {
  try {
    if (!req.body.name || !req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const last_store = await store.findOne({ where: { address: req.body.address } });

    if (last_store) {
      res.status(400).json({ state: 'F', error: "There's another store in the same address" });
      return;
    }
    await store.create({
      id: uuid(),
      name: req.body.name,
      address: req.body.address,
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
async function sshow_all(req, res) {
  try {
    const stores = await store.findAll();
    res.status(200).json(stores);
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// READ ONE
async function sshow(req, res) {
  try {
    if (!req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_store = await store.findOne({ where: { address: req.body.address } });
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store address doesn\'t exist' });
      return;
    }
    res.status(200).json(current_store);
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// UPDATE
async function update(req, res) {
  try {
    if (!req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_store = await store.findOne({ where: { address: req.body.address } });

    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store address doesn\'t exist' });
      return;
    }

    if (req.body.new_address) {
      const last_store = await store.findOne({ where: { address: req.body.new_address } });
      if (last_store) {
        res.status(400).json({ state: 'F', error: 'This address already exist' });
        return;
      }
    }

    await store.update({
      name: ((req.body.name) ? req.body.name : current_store.name),
      address: ((req.body.new_address) ? req.body.new_address : current_store.address),
    }, { where: { address: req.body.address } });

    res.status(200).json({ state: 'OK' });
    return;
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// DELETE
async function sdelete(req, res) {
  try {
    if (!req.body.address) {
      return res.status(400).json({ state: 'F', error: 'Invalid fields' });
    }

    const current_store = await store.findOne({ where: { address: req.body.address } });

    if (!current_store) {
      return res.status(400).json({ state: 'F', error: 'Store address doesn\'t exist' });
    }
    const udestroy = await store.destroy({
      where: {
        address: req.body.address,
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
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
