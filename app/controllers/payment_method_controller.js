const { uuid } = require('uuidv4');
const { payment_method } = require('../models');

/**
 * @swagger
 * /payment-methods:
 *  post:
 *    tags:
 *      - Payment Methods
 *    summary: new payment method
 *    description: Allows to create a new payment method
 *    operationId: payment-methods.create
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                unique: true
 *    responses:
 *      '201':
 *        description: Payment method created successfully
 *      '400':
 *        description: Name not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function create(req, res) {
  try {
    if (!req.body.name) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        'You must send the name of the payment method to be able to create one',
        'Invalid fields',
      );
      return;
    }

    const existing_method = await payment_method.findOne({
      where: { name: req.body.name },
    });

    if (existing_method) {
      res.status(400).json({ state: 'F', error: 'Payment method already exists' });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        `Unable to create a payment method with the name '${req.body.name}'`,
        'Payment method already exists',
      );
      return;
    }

    const new_method = await payment_method.create({
      id: uuid(),
      name: req.body.name,
    });
    res.status(201).json({
      state: 'OK',
      paymentMethod: new_method,
    });
    req.app.locals.logger.debugLog(
      'payment_method_controller.js',
      `Successfully create '${req.body.name}' payment method`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'payment_method_controller.js',
      'Internal server error trying to create a payment method',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /payment-methods:
 *  get:
 *    tags:
 *      - Payment Methods
 *    summary: list of payment methods
 *    description: Allows to retrieve a list of payment methods
 *    operationId: payment-methods.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of payment-methods retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function show_all(req, res) {
  try {
    const methods_list = await payment_method.findAll();
    res.status(200).json(methods_list);
    req.app.locals.logger.debugLog(
      'payment_method_controller.js',
      'Successfully read all payment methods from database',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'payment_method_controller.js',
      'Internal server error trying to read all payment methods',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /payment-methods/show:
 *  post:
 *    tags:
 *      - Payment Methods
 *    summary: one payment method
 *    description: Allows to retrieve one payment method
 *    operationId: payment-methods.show
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Information of the payment method retrieved successfully
 *      '400':
 *        description: Name not sent
 *      '404':
 *        description: payment method does not exist
 *      '500':
 *        description: Internal server error
 */
async function show(req, res) {
  try {
    if (!req.body.name) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        'You must send the name of the payment method to be able to read one',
        'Invalid fields',
      );
      return;
    }

    const current_method = await payment_method.findOne({
      where: { name: req.body.name },
    });

    if (!current_method) {
      res.status(404).json({ state: 'F', error: "Payment method doesn't exist" });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        `Unable to read a payment method with the name '${req.body.name}'`,
        "Payment method doesn't exist",
      );
      return;
    }
    res.status(200).json(current_method);
    req.app.locals.logger.debugLog(
      'payment_method_controller.js',
      `Successfully read '${req.body.name}' payment method from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'payment_method_controller.js',
      'Internal server error trying to read a payment method',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /payment-methods:
 *  delete:
 *    tags:
 *      - Payment Methods
 *    summary: delete one payment method
 *    description: Allows to delete one payment method
 *    operationId: payment-methods.destroy
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Payment method deleted successfully
 *      '400':
 *        description: Name not sent
 *      '404':
 *        description: payment method does not exist
 *      '500':
 *        description: Internal server error
 */
async function pdelete(req, res) {
  try {
    if (!req.body.name) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        'You must send the name of the payment method to be able to delete one',
        'Invalid fields',
      );
      return;
    }
    const curr_method = await payment_method.findOne({
      where: { name: req.body.name },
    });
    if (!curr_method) {
      res.status(404).json({ state: 'F', error: "Payment method doesn't exist" });
      req.app.locals.logger.warnLog(
        'payment_method_controller.js',
        `Unable to delete a payment method with the name '${req.body.name}'`,
        "Payment method doesn't exist",
      );
      return;
    }

    await payment_method.destroy({
      where: {
        name: req.body.name,
      },
    });
    res.status(204).json({});
    req.app.locals.logger.debugLog(
      'payment_method_controller.js',
      `Successfully delete '${req.body.name}' payment method from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'payment_method_controller.js',
      'Internal server error trying to delete a payment method',
      e.parent.sqlMessage,
    );
  }
}

module.exports = {
  show_all,
  show_one: show,
  create,
  delete: pdelete,
};
