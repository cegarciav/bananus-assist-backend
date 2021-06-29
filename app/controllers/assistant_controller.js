const { assistant, user, store, call } = require('../models');
const { uuid } = require('uuidv4');
const { Op } = require("sequelize")
const Sequelize = require("sequelize")

//PARAMETER
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

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
async function accept(req, res){
  try{
    if (!req.body.assistantId){
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    let [today, first_day] = await Interval();
    console.log(today.getFullYear(), first_day)
    let last_record = await call.findOne({where:{
      date: {
        [Op.between]: [first_day, today]
      },
      userId: req.body.assistantId
    }})

    if(!last_record){
      await call.create({
        calls:1,
        date: today,
        year: today.getFullYear(),
        month: today.getMonth(),
        userId: req.body.assistantId
      })
      res.status(200).json({state:"OK"})
      return
    }
    await call.update({
      calls: last_record.calls + 1
    }, {where: {
      id: last_record.id
    }})
    res.status(200).json({state:"OK"})
    return
  } catch (error){
    console.log(error)
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}
//Interval of time since the first day of the month to now.
async function Interval(){
  let today = new Date();
  let first_day = new Date(today.getFullYear(), today.getMonth(), 1)
  return [today, first_day]
}

//KPI: Number of calls per month, per assistant
async function calls_per_month(req, res){
  try{
    if (!req.body.assistantId){
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    let kpis = await call.findAll({attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },where: {
      userId: req.body.assistantId
    }, order: [['date', 'DESC']]})

    res.status(200).json({data: kpis})
  } catch {
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

//KPI Total calls per month, GLOBAL

async function calls_per_month_globally(req, res){
  try{
    let kpi = await call.findAll({
      attributes: [
          'year',
          'month',
          [Sequelize.fn('SUM', Sequelize.col('calls')), 'calls']
      ],
      group: ['year','month'],
      order: [['year', 'DESC'],['month', 'DESC']]
      });
    
    res.status(200).json({data: kpi})
  } catch(error){
    console.log(error)
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
  accept: accept,
  kpi: calls_per_month,
  kpi_globally: calls_per_month_globally
};

