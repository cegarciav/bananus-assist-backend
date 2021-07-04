const Sequelize = require('sequelize');
const { user, call } = require('../models');

// KPI: Number of calls per month, per assistant
async function calls_per_month(req, res) {
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
async function calls_per_month_globally(req, res) {
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
module.exports = {
  single_kpi: calls_per_month,
  global_kpi: calls_per_month_globally,
};
