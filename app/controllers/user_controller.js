const { uuid } = require('uuidv4');
const { user, store, assistant } = require('../models');
const { sendMail } = require('../config/mail.js');
const faker = require('faker');

// CREATE
async function ucreate(req, res) {
  try {
    if (!req.body.name || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = ((req.body.address) ? await store.findOne({ where: { address: req.body.address } }): true);
    if (current_user) {
      res.status(400).json({ state: 'F', error: 'Email already in use' });
      return;
    }
    else if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    else if(req.body.address && req.body.rol !== 'supervisor'){
      res.status(400).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
      return;
    }
    
    const password = faker.internet.password();

    await user.create({
      id: uuid(),
      name: req.body.name,
      password: password,
      email: req.body.email,
      storeId: ((current_store)? current_store.id : null),
      rol: req.body.rol,
    });
    sendMail(req.body.email,req.body.name, password, function(err,data){
      if(err){
        console.log(data);
      }
    });
    res.status(201).json({
      state: 'OK',
    });
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
    return;
  }
}

// READ ALL
async function ushow_all(req, res) {
  try{
    const users = await user.findAll({ include: store });
    res.status(200).json(users);
  } catch{
    res.status(500).json({
      state: "F",
      error: "Internal server error"
    })
    return;
  }
}

// READ ONE
async function ushow(req, res) {
  try {
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
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }}

// UPDATE
async function update(req, res) {
  try{
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
    const current_store = ((req.body.address) ? await store.findOne({ where: { address: req.body.address } }): true);
    const rol = ((req.body.rol) ? req.body.rol: current_user.rol);
    const new_store = ((req.body.address) ? await store.findOne({ where: { address: req.body.address } }): current_user.storeId);
    
    if(!current_store){
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    else if(rol !== 'supervisor' && new_store){
      res.status(400).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
      return;
    }

    if(rol !== current_user.rol && current_user.rol === 'supervisor'){
      current_user.storeId = null;
    }

    await user.update({
      name: ((req.body.name) ? req.body.name : current_user.name),
      password: ((req.body.password) ? req.body.password : current_user.password),
      email: ((req.body.new_email) ? req.body.new_email : current_user.email),
      storeId: ((req.body.address) ? current_store.id: current_user.storeId),
      rol: ((req.body.rol) ? req.body.rol: current_user.rol),
    }, { where: { email: current_user.email }, individualHooks:true, });
    res.status(200).json({ state: 'OK' });
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}
// DELETE
async function udelete(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }
  try {
  const current_user = await user.findOne({ where: { email: req.body.email } });
  if (!current_user) {
    res.status(400).json({ state: 'F', error: 'User email doesnt exist' });
    return;
  }
    await user.destroy({
      where: {
        email: req.body.email,
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
  show_all: ushow_all,
  show_one: ushow,
  create: ucreate,
  update,
  delete: udelete,
};
