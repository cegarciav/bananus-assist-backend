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
 *      '500':
 *        description: Internal server error
 */
async function ucreate(req, res) {
  try {
    if (!req.body.name || !req.body.email) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
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
      return;
    }
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store doesnt exist' });
      return;
    }
    if (req.body.address && req.body.rol !== 'supervisor') {
      res.status(400).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
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
        // eslint-disable-next-line no-console
        console.log(data);
      }
    });
    res.status(201).json({
      state: 'OK',
    });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
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
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of users retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function ushow_all(req, res) {
  try {
    const users = await user.findAll({ include: store });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
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
 *        description: Email not sent or user does not exist
 *      '500':
 *        description: Internal server error
 */
async function ushow(req, res) {
  if (!req.body.email) {
    res.status(400).json({ state: 'F', error: 'Invalid fields' });
    return;
  }
  try {
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
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
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
 *              new_email:
 *                type: string
 *                format: email
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
 *        description: Email not sent, user does not exist, or some of the fields sent are not valid
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
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
      return;
    }
    if (rol !== 'supervisor' && new_store) {
      res.status(400).json({ state: 'F', error: 'User must be a supervisor to be able to assign a store' });
      return;
    }

    if (rol !== current_user.rol && current_user.rol === 'supervisor') {
      current_user.storeId = null;
    }

    await user.update({
      name: req.body.name || current_user.name,
      password: req.body.password || current_user.password,
      email: req.body.new_email || current_user.email,
      storeId: ((req.body.address) ? current_store.id : current_user.storeId),
      rol: req.body.rol || current_user.rol,
    }, {
      where: { email: current_user.email },
      individualHooks: true,
    });
    res.status(200).json({ state: 'OK' });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
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
 *        description: User deleted successfully
 *      '400':
 *        description: Email not sent or user does not exist
 *      '500':
 *        description: Internal server error
 */
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
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
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
