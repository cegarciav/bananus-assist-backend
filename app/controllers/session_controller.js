require('dotenv').config();
const jwt = require('jsonwebtoken');
const { user, device, central_tablet } = require('../models');

async function set_middleware(req, res, next) {
  req.logged = false;
  if (req.headers.token) {
    let curr_user;
    let curr_device;
    let curr_central_tablet;
    let curr_entity;
    try {
      curr_user = await user.findOne({ where: { token: req.headers.token } });
      curr_device = await device.findOne({ where: { token: req.headers.token } });
      curr_central_tablet = await central_tablet.findOne({ where: { token: req.headers.token } });
      curr_entity = curr_device || curr_central_tablet;
    } catch {
      res.status(500).json({ state: 'F', error: 'Internal server error' });
      return null;
    }
    if (curr_user) {
      try {
        const payload = await jwt.verify(req.headers.token, process.env.JWT_SECRET);
        req.logged = true;
        req.email = payload;
        return next();
      } catch (err) {
        return next();
      }
    }
    if (curr_entity) {
      try {
        const payload = await jwt.verify(req.headers.token, process.env.JWT_SECRET);
        req.logged = true;
        req.device = ((curr_device) ? 'device' : 'central_tablet');
        req.serialNumber = payload;
        return next();
      } catch (err) {
        return next();
      }
    }
  }
  return next();
}

/**
 * @swagger
 * /sessions:
 *  post:
 *    tags:
 *      - Users
 *    summary: log in
 *    description: Allows a user to log in the application
 *    operationId: users.login
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: User logged-in successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function log_in_user(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_user = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    const match = ((curr_user) ? await curr_user.checkPassword(req.body.password) : false);
    if (curr_user && match) {
      const token = jwt.sign(req.body.email, process.env.JWT_SECRET);
      await user.update({ token },
        { where: { email: req.body.email } });
      res.status(200).json({ state: 'OK', token });
      return;
    }
    res.status(400).json({ state: 'F', error: 'Invalid email or password' });
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
  }
}

/**
 * @swagger
 * /sessions:
 *  delete:
 *    tags:
 *      - Users
 *    summary: log out
 *    description: Allows a user to log out the application
 *    operationId: users.logout
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
 *        description: User logged-out successfully
 *      '500':
 *        description: Internal server error
 */
async function log_out_user(req, res) {
  try {
    await user.update({ token: null }, { where: { email: req.email } });
    res.status(200).json({ state: 'OK' });
    return;
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
  }
}

/**
 * @swagger
 * /sessions/devices:
 *  post:
 *    tags:
 *      - Devices
 *      - Central Tablets
 *    summary: log in
 *    description: Allows a device or central tablet to log in the application
 *    operationId: devices.login
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *              - password
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: Device or Central Tablet logged-in successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function log_in_devices(req, res) {
  try {
    if (!req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_normal_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    const curr_central_device = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    const curr_device = curr_normal_device || curr_central_device;
    const type_device = ((curr_normal_device) ? 'device' : 'central');

    const match = ((curr_device) ? await curr_device.checkPassword(req.body.password) : false);
    if (curr_device && match) {
      const token = jwt.sign(req.body.serialNumber, process.env.JWT_SECRET);
      if (type_device === 'device') {
        await device.update({ token }, {
          where: { serialNumber: req.body.serialNumber },
        });
      } else {
        await central_tablet.update({ token }, {
          where: { serialNumber: req.body.serialNumber },
        });
      }
      res.status(200).json({ state: 'OK', token, type: type_device });
      return;
    }
    res.status(400).json({ state: 'F', error: 'Invalid Serial Number or password' });
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
  }
}

/**
 * @swagger
 * /sessions/devices:
 *  delete:
 *    tags:
 *      - Devices
 *      - Central Tablets
 *    summary: log out
 *    description: Allows a device or central tablet to log out the application
 *    operationId: devices.logout
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - serialNumber
 *            properties:
 *              serialNumber:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Device or Central Tablet logged-out successfully
 *      '500':
 *        description: Internal server error
 */
async function log_out_devices(req, res) {
  const curr_device = ((req.device === 'device') ? device : central_tablet);
  try {
    await curr_device.update({ token: null }, { where: { serialNumber: req.serialNumber } });
    return res.status(200).json({ state: 'OK' });
  } catch (e) {
    return res.status(500).json({ state: 'F', error: 'Internal server error' });
  }
}

async function only_logged(req, res, next) {
  if (req.logged) {
    return next();
  }
  return res.status(400).json({ state: 'F', error: 'You must be logged to do this' });
}

async function only_unlogged(req, res, next) {
  if (!req.logged) {
    return next();
  }
  return res.status(400).json({ state: 'F', error: 'You must be unlogged to do this' });
}

async function only_user(req, res, next) {
  if (req.email) {
    return next();
  }
  return res.status(400).json({ state: 'F', error: 'Only users can do this action' });
}

async function only_device(req, res, next) {
  if (req.device && req.serialNumber) {
    return next();
  }
  return res.status(400).json({ state: 'F', error: 'Only devices or tablets can do this action' });
}
module.exports = {
  check_session: set_middleware,
  log_in_user,
  log_out_user,
  log_in_devices,
  log_out_devices,
  filters: {
    only_logged,
    only_unlogged,
    only_user,
    only_device,
  },
};
