const { assistant, user, store, call} = require('../models');
const Interval = require('../utils/Time').Interval;
const { Op } = require("sequelize")
const Sequelize = require("sequelize")

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

    if(current_user && current_store){
      current_assistant = await assistant.findOne({ where: { userId: current_user.id, storeId: current_store.id } });
    }
    
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
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

//ACCEPT VIDEOCALL
async function accept_call(req, res){
  try{

    let [today, first_day] = await Interval();

    let last_record = await call.findOne({where:{
      date: {
        [Op.between]: [first_day, today]
      },
      userId: req.assistantId
    }})

    if(!last_record){
      await call.create({
        calls:1,
        date: today,
        userId: req.assistantId
      })
      return res.status(200).json({state:"OK"})
    }
    await call.update({
      calls: last_record.calls + 1
    }, {where: {
      id: last_record.id
    }})
    return res.status(200).json({state:"OK"})
  } catch {
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
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

    if(current_user && current_store){
      current_assistant = await assistant.findOne({ where: { userId: current_user.id, storeId: current_store.id } });
    }

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
    await assistant.destroy({
      where: {
        userId: current_user.id,
        storeId: current_store.id,
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
  create: ascreate,
  delete: asdelete,
  accept: accept_call
};

