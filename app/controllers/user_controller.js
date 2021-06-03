const { uuid } = require('uuidv4');
const { user, store } = require('../models');

// CREATE
async function ucreate(req, res) {
  if (!req.body.name || !req.body.password || !req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }
  const current_user = await user.findOne({ where: { email: req.body.email } });
  if (current_user) {
    res.status(400).json({ state: 'F', error: 'Email already in use' });
    return;
  }
  try {
    await user.create({
      id: uuid(),
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });
    res.status(201).json({
      state: 'OK',
    });
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}

// READ ALL
async function ushow_all(req, res) {
  const users = await user.findAll({ include: store });
  res.status(200).json(users);
}

// READ ONE
async function ushow(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }
  const current_user = await user.findOne({
    where: { email: req.body.email },
    include: [
      {
        model: store,
      },
    ],
  });
  if (!current_user) {
    res.status(400).json({ state: 'F', error: 'User email doesnt exist' });
    return;
  }
  res.status(200).json(current_user);
}

// UPDATE
async function update(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }

  const current_user = await user.findOne({ where: { email: req.body.email } });

  if (!current_user) {
    res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
    return;
  }
  if (req.body.new_email) {
    const last_user = await user.findOne({ where: { email: req.body.new_email } });
    if (last_user) {
      res.status(400).json({ state: 'F', error: 'New email already in use' });
      return;
    }
  }
  try {
    await user.update({
      name: ((req.body.name) ? req.body.name : current_user.name),
      password: ((req.body.password) ? req.body.password : current_user.password),
      email: ((req.body.new_email) ? req.body.new_email : current_user.email),
    }, { where: { email: current_user.email } });

    res.status(200).json({ state: 'OK' });
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error,
    });
  }
}
// DELETE
async function udelete(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }
  const current_user = await user.findOne({ where: { email: req.body.email } });
  if (!current_user) {
    res.status(400).json({ state: 'F', error: 'User email doesnt exist' });
    return;
  }
  try {
    await user.destroy({
      where: {
        email: req.body.email,
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
  show_all: ushow_all,
  show_one: ushow,
  create: ucreate,
  update,
  delete: udelete,
};
