const { Op } = require('sequelize');
const {
  assistant,
  user,
  store,
  call,
} = require('../models');
const { Interval } = require('../utils/Time');

/**
 * @swagger
 * /assistants:
 *  post:
 *    tags:
 *      - Assistants
 *    summary: new assistant
 *    description: Allows to assign an assistant to a given store
 *    operationId: assistants.create
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - address
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: email of an existing user
 *              address:
 *                type: string
 *                description: address of an existing store
 *    responses:
 *      '201':
 *        description: Assistant created successfully
 *      '400':
 *        description: Email or address not valid or missing
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function ascreate(req, res) {
  try {
    if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        'You must send the address of the store and the email of the user to be able to assing an assistant',
        'Invalid fields',
      );
      return;
    }

    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    let current_assistant = null;

    if (current_user && current_store) {
      current_assistant = await assistant.findOne({
        where: { userId: current_user.id, storeId: current_store.id },
      });
    }

    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to assing user '${req.body.email}' to the store '${req.body.address}'`,
        "User's email doesnt exist",
      );
      return;
    }
    if (current_user.rol !== 'assistant') {
      res.status(400).json({ state: 'F', error: 'User must be an assistant' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to assing user '${req.body.email}' to the store '${req.body.address}'`,
        'User must be an assistant',
      );
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to assing user '${req.body.email}' to the store '${req.body.address}'`,
        'Store doesnt exist',
      );
      return;
    }
    if (current_assistant) {
      res.status(400).json({ state: 'F', error: 'User is already assistant in the store' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to assing user '${req.body.email}' to the store '${req.body.address}'. Duplicate data`,
        'User is already assistant in the store',
      );
      return;
    }
    await assistant.create({
      storeId: current_store.id,
      userId: current_user.id,
    });
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'assistant_controler.js',
      `Assistant '${req.body.email}' assing to the store '${req.body.address}' successfully`,
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /assistants:
 *  patch:
 *    tags:
 *      - Assistants
 *    summary: register a call answered
 *    description: register a call answered by a given assistant
 *    operationId: assistant.calls-modify
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '201':
 *        description: Answered call registered successfully
 *      '403':
 *        description: You don't have the authorization to create this resource
 *      '500':
 *        description: Internal server error
 */
async function accept_call(req, res) {
  try {
    const [today, first_day] = await Interval();

    const last_record = await call.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: req.assistantId,
      },
    });

    if (!last_record) {
      await call.create({
        calls: 1,
        date: today,
        userId: req.assistantId,
      });
      res.status(201).json({ state: 'OK' });
      return;
    }
    await call.update({
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
    req.app.locals.logger.errorLog(
      'assistant_controler.js',
      'Internal server error trying to assing assistant to a store',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /assistants:
 *  delete:
 *    tags:
 *      - Assistants
 *    summary: delete one assistant
 *    description: Allows to delete one assistant
 *    operationId: assistants.destroy
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - address
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: email of an existing user
 *              address:
 *                type: string
 *                description: address of an existing store
 *    responses:
 *      '204':
 *        description: Assistant deleted successfully
 *      '400':
 *        description: Email or address not valid or missing
 *      '403':
 *        description: You don't have the authorization to delete this resource
 *      '404':
 *        description: User is not an assistant of the given store
 *      '500':
 *        description: Internal server error
 */
async function asdelete(req, res) {
  try {
    if (!req.body.address || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        'You must send the address of the store and the email of the user to be able to unassing an assistant',
        'Invalid fields',
      );
      return;
    }
    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = await store.findOne({ where: { address: req.body.address } });
    let current_assistant = null;

    if (current_user && current_store) {
      current_assistant = await assistant.findOne({
        where: { userId: current_user.id, storeId: current_store.id },
      });
    }

    if (!current_user) {
      res.status(400).json({ state: 'F', error: "User's email doesnt exist" });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to unassing user '${req.body.email}' from the store '${req.body.address}'`,
        "User's email doesnt exist",
      );
      return;
    }
    if (current_user.rol !== 'assistant') {
      res.status(400).json({ state: 'F', error: 'User must be an assistant' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to unassing user '${req.body.email}' from the store '${req.body.address}'`,
        'User must be an assistant',
      );
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to unassing user '${req.body.email}' from the store '${req.body.address}'`,
        'Store doesnt exist',
      );
      return;
    }
    if (!current_assistant) {
      res.status(404).json({ state: 'F', error: 'User is not a store assistant' });
      req.app.locals.logger.warnLog(
        'assistant_controler.js',
        `Unable to unassing user '${req.body.email}' from the store '${req.body.address}'. Non-existent data`,
        'User is not a store assistant',
      );
      return;
    }
    await assistant.destroy({
      where: {
        userId: current_user.id,
        storeId: current_store.id,
      },
    });

    res.status(204).json({
      state: 'OK',
    });

    req.app.locals.logger.debugLog(
      'assistant_controler.js',
      `Assistant '${req.body.email}' unassing from the store '${req.body.address}' successfully`,
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'assistant_controler.js',
      'Internal server error trying to unassing assistant from a store',
      e.parent.sqlMessage,
    );
  }
}

module.exports = {
  create: ascreate,
  delete: asdelete,
  accept: accept_call,
};
