const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { user, call, call_request } = require('../models');
const { Interval } = require('../utils/Time');

/**
 * @swagger
 * /kpis:
 *  post:
 *    tags:
 *      - KPIs
 *    summary: amount of calls answered by a given assistant
 *    description: |
 *      Allows to retrieve de amount of successful calls answered
 *      by a given assistant
 *    operationId: kpis.successful-calls
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '201':
 *        description: Call registered successfully
 *      '400':
 *        description: Assistant's email not valid or missing
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
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

/**
 * @swagger
 * /kpis:
 *  get:
 *    tags:
 *      - KPIs
 *    summary: amount of successful calls performed in the system
 *    description: Allows to retrieve the total amount of calls received
 *                 and answered by the assistants, grouped by date (month/year)
 *    operationId: kpis.call-list
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: amount of successful calls retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
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

/**
 * @swagger
 * /assistants/call:
 *  post:
 *    tags:
 *      - Assistants
 *    summary: register a call request to the system
 *    description: |
 *      Allows to leave a register of a call request coming
 *      from users of the catalog
 *    operationId: assistants.call-request
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *    responses:
 *      '201':
 *        description: Call registered successfully
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function enter_call(req, res) {
  try {
    const [today, first_day] = await Interval();
    const last_record = await call_request.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
      },
    });
    if (!last_record) {
      await call_request.create({
        calls: 1,
        date: today,
      });
      res.status(201).json({ state: 'OK' });
      return;
    }
    await call_request.update({
      calls: last_record.calls + 1,
    }, {
      where: {
        id: last_record.id,
      },
    });
    res.status(201).json({ state: 'OK' });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /kpis/total:
 *  get:
 *    tags:
 *      - KPIs
 *    summary: amount of calls requests received by the system
 *    description: |
 *      Allows to retrieve the total amount of calls received
 *      by the system, grouped by date (month/year)
 *    operationId: kpis.total
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: amount of call requests retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
async function total_calls_accepted_per_month_globally(req, res) {
  try {
    const kpi = await call_request.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('date')), 'current_year'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'current_month'],
        'calls',
      ],
      order: [
        [Sequelize.literal('current_year'), 'DESC'],
        [Sequelize.literal('current_month'), 'DESC'],
      ],
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
  enter: enter_call,
};
