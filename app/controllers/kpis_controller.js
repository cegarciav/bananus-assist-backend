const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { user, call, call_request } = require('../models');
const Interval = require('../utils/Time').Interval
// KPI: Number of calls per month, per assistant
async function calls_accepted_per_month(req, res) {
  try {
    if (!req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_assistant = await user.findOne({
      where: { email: req.body.email },
    });
    if (!current_assistant) {
      res.status(400).json({ state: 'F', error: 'Invalid email' });
      return;
    }
    const kpis = await call.findAll({
      attributes: { exclude: ['id'] },
      where: {
        userId: current_assistant.id,
      },
      order: [['date', 'DESC']],
    });

    res.status(200).json({ data: kpis });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

// KPI Total calls per month, GLOBAL
async function calls_accepted_per_month_globally(req, res) {
  try {
    const kpi = await call.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'current_year'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'current_month'],
        [Sequelize.fn('SUM', Sequelize.col('calls')), 'calls'],
      ],
      group: [Sequelize.literal('current_year'), Sequelize.literal('current_month')],
      order: [[Sequelize.literal('current_year'), 'DESC'], [Sequelize.literal('current_month'), 'DESC']],
    });
    res.status(200).json({ data: kpi });
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}


// KPI: Total calls
//Call request entering
async function enter_call(req, res) {
  try {
    const [today, first_day] = await Interval();
    const last_record = await call_request.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        }
      },
    });
    if (!last_record) {
      await call_request.create({
        calls: 1,
        date: today
      });
      res.status(200).json({ state: 'OK' });
      return;
    }
    await call_request.update({
      calls: last_record.calls + 1,
    }, {
      where: {
        id: last_record.id,
      },
    });
    res.status(200).json({ state: 'OK' });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

// KPI Total calls per month, GLOBAL
async function total_calls_accepted_per_month_globally(req, res) {
  try {
    const kpi = await call_request.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'current_year'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'current_month'],
        'calls'
      ],
      order: [[Sequelize.literal('current_year'), 'DESC'], [Sequelize.literal('current_month'), 'DESC']],
    });
    res.status(200).json({ data: kpi });
  } catch (error) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  single_kpi: calls_accepted_per_month,
  global_kpi: calls_accepted_per_month_globally,
  total_kpi: total_calls_accepted_per_month_globally,
  enter: enter_call
};
