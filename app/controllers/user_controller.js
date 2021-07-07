const { uuid } = require('uuidv4');
const faker = require('faker');
const { user, store } = require('../models');
const { sendMail } = require('../config/mail.js');

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *      - Users
 *    summary: new user
 *    description: Allows to create a new user
 *    operationId: users.create
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *              - email
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              address:
 *                type: string
 *                description: address of an existing store
 *              rol:
 *                type: string
 *    responses:
 *      '201':
 *        description: User created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '403':
 *        description: You don't have the authorization to create this resource or
 *                     to assign some of the fields sent
 *      '500':
 *        description: Internal server error
 */
async function ucreate(req, res) {
  try {
    if (!req.body.name || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        'You must send the name and email of the user to be able to create one',
        'Invalid fields',
      );
      return;
    }
    const current_user = await user.findOne({ where: { email: req.body.email } });
    const current_store = (
      (req.body.address)
        ? await store.findOne({ where: { address: req.body.address } })
        : true
    );
    if (current_user) {
      res.status(400).json({ state: 'F', error: 'Email already in use' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to create a user with the email '${req.body.email}'`,
        'Email already in use',
      );
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to create a user with the store '${req.body.address}'`,
        'Store doesnt exist',
      );
      return;
    }
    if (req.body.address && req.body.rol !== 'supervisor') {
      res.status(403).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to create a user with the store '${req.body.address}'`,
        'User must be a supervisor to be able to assign a store',
      );
      return;
    }

    const password = faker.internet.password();

    await user.create({
      id: uuid(),
      name: req.body.name,
      password,
      email: req.body.email,
      storeId: ((current_store) ? current_store.id : null),
      rol: req.body.rol,
    });
    sendMail(req.body.email, req.body.name, password, (err, data) => {
      if (err) {
        req.app.locals.logger.errorLog(
          'user_controller.js',
          `Unable to send the welcome email to the user'${req.body.email}'`,
          data,
        );
      }
    });
    res.status(201).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'user_controller.js',
      `Successfully create '${req.body.email}' user`,
      'Ok',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'user_controller.js',
      'Internal server error trying to create a user',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *      - Users
 *    summary: list of users
 *    description: Allows to retrieve a list of users
 *    operationId: users.list
 *    security:
 *      - apiKey: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of users retrieved successfully
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '500':
 *        description: Internal server error
 */
async function ushow_all(req, res) {
  try {
    const users = await user.findAll({ include: store });
    res.status(200).json(users);
    req.app.locals.logger.debugLog(
      'user_controller.js',
      'Successfully read all users from database',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'user_controller.js',
      'Internal server error trying to read all users',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /users/show:
 *  post:
 *    tags:
 *      - Users
 *    summary: one user
 *    description: Allows to retrieve one user
 *    operationId: users.show
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
 *      '200':
 *        description: Information of the user retrieved successfully
 *      '400':
 *        description: Email not sent
 *      '403':
 *        description: You don't have the authorization to read this resource
 *      '404':
 *        description: User does not exist
 *      '500':
 *        description: Internal server error
 */
async function ushow(req, res) {
  try {
    if (!req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        'You must send the email of the user to be able to read one',
        'Invalid fields',
      );
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
      res.status(404).json({ state: 'F', error: 'User email doesnt exist' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to read a user with the email '${req.body.email}'`,
        'User email doesnt exist',
      );
      return;
    }
    res.status(200).json(current_user);
    req.app.locals.logger.debugLog(
      'user_controller.js',
      `Successfully read '${req.body.email}' user from database`,
      'Ok',
    );
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'user_controller.js',
      'Internal server error trying to read a user',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /users:
 *  patch:
 *    tags:
 *      - Users
 *    summary: edit one user
 *    description: Allows to modify one user
 *    operationId: users.modify
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
 *                unique: true
 *              new_email:
 *                type: string
 *                format: email
 *                unique: true
 *              name:
 *                type: string
 *              address:
 *                type: string
 *                description: address of an existing store
 *              rol:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: User updated successfully
 *      '400':
 *        description: Email not sent or some of the fields sent are not valid
 *      '403':
 *        description: You don't have the authorization to modify this resources or
 *                     some of the fields sent
 *      '404':
 *        description: User does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        'You must send the email of the user to be able to update one',
        'Invalid fields',
      );
      return;
    }

    const current_user = await user.findOne({ where: { email: req.body.email } });

    if (!current_user) {
      res.status(404).json({ state: 'F', error: "User's email doesnt exist" });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to update the user '${req.body.email}'`,
        "User's email doesnt exist",
      );
      return;
    }
    if (req.body.new_email) {
      const last_user = await user.findOne({ where: { email: req.body.new_email } });
      if (last_user) {
        res.status(400).json({ state: 'F', error: 'New email already in use' });
        req.app.locals.logger.warnLog(
          'user_controller.js',
          `Unable to update the email of the user from '${req.body.email}' to '${req.body.new_email}'`,
          'New email already in use',
        );
        return;
      }
    }
    const current_store = (
      (req.body.address)
        ? await store.findOne({ where: { address: req.body.address } })
        : true
    );
    const rol = req.body.rol || current_user.rol;
    const new_store = (
      (req.body.address)
        ? await store.findOne({ where: { address: req.body.address } })
        : current_user.storeId
    );

    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to update the user '${req.body.email}' with the store '${req.body.address}'`,
        'Store doesnt exist',
      );
      return;
    }
    if (rol !== 'supervisor' && new_store) {
      res.status(403).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to update the user '${req.body.email}' with the store '${req.body.address}'`,
        'User must be a supervisor to be able to assign a store',
      );
      return;
    }

    if (rol !== current_user.rol && current_user.rol === 'supervisor') {
      req.app.locals.logger.debugLog(
        'user_controller.js',
        `User '${req.body.email}' unassing the store '${current_user.storeId}'`,
        `User rol change from '${current_user.rol}' to '${rol}'`,
      );
      current_user.storeId = null;
    }

    await user.update({
      name: req.body.name || current_user.name,
      password: req.body.password || current_user.password,
      email: req.body.new_email || current_user.email,
      storeId: ((req.body.address) ? current_store.id : current_user.storeId),
      rol: req.body.rol || current_user.rol,
    }, { where: { email: current_user.email }, individualHooks: true });
    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog(
      'user_controller.js',
      `Successfully update '${req.body.email}' user`,
      'Ok',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'user_controller.js',
      'Internal server error trying to update a user',
      e.parent.sqlMessage,
    );
  }
}

/**
 * @swagger
 * /users:
 *  delete:
 *    tags:
 *      - Users
 *    summary: delete one user
 *    description: Allows to delete one user
 *    operationId: users.destroy
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
 *      '204':
 *        description: User deleted successfully
 *      '400':
 *        description: Email not sent
 *      '403':
 *        description: You don't have the authorization to delete this resource
 *      '404':
 *        description: User with the email sent doesn't exist
 *      '500':
 *        description: Internal server error
 */
async function udelete(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    req.app.locals.logger.warnLog(
      'user_controller.js',
      'You must send the email of the user to be able to delete one',
      'Invalid fields',
    );
    return;
  }
  try {
    const current_user = await user.findOne({ where: { email: req.body.email } });
    if (!current_user) {
      res.status(404).json({ state: 'F', error: 'User email doesnt exist' });
      req.app.locals.logger.warnLog(
        'user_controller.js',
        `Unable to delete a user with the email '${req.body.email}'`,
        'User email doesnt exist',
      );
      return;
    }
    await user.destroy({
      where: {
        email: req.body.email,
      },
    });

    res.status(204).json({
      state: 'OK',
    });
    req.app.locals.logger.debugLog(
      'user_controller.js',
      `Successfully delete '${req.body.email}' user from database`,
      'Ok',
    );
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
    req.app.locals.logger.errorLog(
      'user_controller.js',
      'Internal server error trying to delete a user',
      e.parent.sqlMessage,
    );
  }
}

module.exports = {
  show_all: ushow_all,
  show_one: ushow,
  create: ucreate,
  update,
  delete: udelete,
};
