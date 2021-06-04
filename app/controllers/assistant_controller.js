const { assistant, user, store } = require('../models');
const { uuid } = require('uuidv4');

// CREATE
async function ascreate(req, res) {
  try {
    if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    const current_assistant = await assistant.findOne({ where: { userId: current_user.id, storeId: current_store.id } });
    
    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      return;
    }
    else if(current_user.rol !== 'assistant'){
        res.status(400).json({ state: 'F', error: 'User must be an assistant' });
        return;
    }  
    else if(!current_store){
        res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
        return;
    }
    else if(current_assistant){
        res.status(400).json({ state: 'F', error: 'User is already a store assistant' });
        return;
    }

    await assistant.create({
      id: uuid(),
      storeId: current_store.id,
      userId: current_user.id,
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


// DELETE
async function asdelete(req, res) {
  if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    const current_assistant = await assistant.findOne({ where: { userId: current_user.id, storeId: current_store.id } });

    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      return;
    }
    else if(current_user.rol !== 'assistant'){
        res.status(400).json({ state: 'F', error: 'User must be an assistant' });
        return;
    } 
    else if(!current_store){
        res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
        return;
    }

    else if(!current_assistant){
        res.status(400).json({ state: 'F', error: 'User is not a store assistant' });
        return;
    }
  try {
    await assistant.destroy({
      where: {
        userId: current_user.id,
        storeId: current_store.id,
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
  create: ascreate,
  delete: asdelete,
};

