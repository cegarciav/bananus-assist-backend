require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  user,
  device,
  central_tablet,
  sale_point,
} = require('../models');

async function set_middleware(req, res, next) {
  req.logged = false;
  if (req.headers['authorization']) {
    let curr_user;
    let curr_device;
    let curr_central_tablet;
    let curr_entity;
    try {
      curr_user = await user.findOne({ where: { token: req.headers['authorization'] } });
      curr_device = await device.findOne({ where: { token: req.headers['authorization'] } });
      curr_central_tablet = await central_tablet.findOne({ where: { token: req.headers['authorization'] } });
      curr_entity = curr_device || curr_central_tablet;
    } catch (e){
      res.status(500).json({ state: 'F', error: 'Internal server error' });
      req.app.locals.logger.errorLog('session_controller.js','Internal server error trying to set up the middleware', e.parent.sqlMessage);
      return null;
    }
    if (curr_user) {
      try {
        const payload = await jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
        req.logged = true;
        req.email = payload;
        req.rol = curr_user.rol;
        if (curr_user.rol === 'assistant') {
          req.assistantId = curr_user.id;
        }
        return next();
      } catch (err) {
        return next();
      }
    }
    if (curr_entity) {
      try {
        const payload = await jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
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

async function log_in_user(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('session_controller.js','You must send the email and the password of an user to be able to log in', 'Invalid fields');
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
      res.status(200).json({ state: 'OK', token, rol: curr_user.rol });
      req.app.locals.logger.debugLog('session_controller.js',`Successfully log in of the user '${req.body.email}'`, 'OK');
      return;
    }
    res.status(400).json({ state: 'F', error: 'Invalid email or password' });
    req.app.locals.logger.warnLog('session_controller.js','Unable to log in user', 'Invalid email or password');
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
    req.app.locals.logger.errorLog('session_controller.js','Internal server error trying to log in an user', e.parent.sqlMessage);
  }
}

async function log_out_user(req, res) {
  try {
    await user.update({ token: null }, { where: { email: req.email } });
    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog('session_controller.js',`Successfully log out of the user '${req.email}'`, 'OK');
    return;
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
    req.app.locals.logger.errorLog('session_controller.js','Internal server error trying to log out an user', e.parent.sqlMessage);
  }
}

async function log_in_devices(req, res) {
  try {
    if (!req.body.serialNumber || !req.body.password) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      req.app.locals.logger.warnLog('session_controller.js','You must send the password and the serial number of a device to be able to log in', 'Invalid fields');
      return;
    }
    const curr_normal_device = await device.findOne({
      where: { serialNumber: req.body.serialNumber },
    });
    const curr_central_device = await central_tablet.findOne({
      where: { serialNumber: req.body.serialNumber },
    });

    const curr_device = curr_normal_device || curr_central_device;
    const type_device = curr_normal_device ? 'device' : 'central';

    const match = ((curr_device) ? await curr_device.checkPassword(req.body.password) : false);
    if (curr_device && match) {
      const token = jwt.sign(req.body.serialNumber, process.env.JWT_SECRET);
      if (type_device === 'device') {
        await device.update({ token },
          { where: { serialNumber: req.body.serialNumber } });
      } else {
        await central_tablet.update({ token },
          { where: { serialNumber: req.body.serialNumber } });
      }
      let tablet_associate = curr_device;
      if (type_device === 'device') {
        tablet_associate = await central_tablet.findOne({
          where: { id: curr_device.central_tabletId },
        });
      }
      const sale_point_associate = await sale_point.findOne({
        where: { id: tablet_associate.sale_pointId },
      });

      res.status(200).json({
        state: 'OK',
        token,
        type: type_device,
        sale_pointId: sale_point_associate.id,
        storeId: sale_point_associate.storeId,
      });
      req.app.locals.logger.debugLog('session_controller.js',`Successfully log in of the device '${req.body.serialNumber}}'`, 'OK');
      return;
    }
    res.status(400).json({ state: 'F', error: 'Invalid Serial Number or password' });
    req.app.locals.logger.warnLog('session_controller.js','Unable to log in device', 'Invalid Serial Number or password');
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
  }
}

async function log_out_devices(req, res) {
  const curr_device = ((req.device === 'device') ? device : central_tablet);
  try {
    await curr_device.update({ token: null }, { where: { serialNumber: req.serialNumber } });
    res.status(200).json({ state: 'OK' });
    req.app.locals.logger.debugLog('session_controller.js',`Successfully log out of the device '${req.serialNumber}'`, 'OK');
  } catch (e) {
    res.status(500).json({ state: 'F', error: 'Internal server error' });
    req.app.locals.logger.errorLog('session_controller.js','Internal server error trying to log out a device', e.parent.sqlMessage);
  }
}

async function only_logged(req, res, next) {
  if (req.logged) {
    return next();
  }
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'You must be logged to do this');
  return res.status(400).json({ state: 'F', error: 'You must be logged to do this' });
}

async function only_unlogged(req, res, next) {
  if (!req.logged) {
    return next();
  }
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'You must be unlogged to do this');
  return res.status(400).json({ state: 'F', error: 'You must be unlogged to do this' });
}

async function only_user(req, res, next) {
  if (req.email) {
    next();
    return;
  }
  res.status(400).json({ state: 'F', error: 'Only users can do this action' });
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'Only users can do this action' );
}

async function only_device(req, res, next) {
  if (req.device && req.serialNumber) {
    next();
    return;
  }
  res.status(400).json({ state: 'F', error: 'Only devices or tablets can do this action' });
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'Only devices or tablets can do this action');
}

async function only_assistant(req, res, next) {
  if (req.rol === 'assistant') {
    next();
    return;
  }
  res.status(400).json({ state: 'F', error: 'Only assistants can do this action' });
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'Only assistants can do this action');
}

async function only_administrator(req, res, next){
  if(req.rol === 'administrator') {
    next()
    return
  }
  res.status(400).json({ state: 'F', error: 'Only administrators can do this action' });
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'Only administrators can do this action');
}

async function administrator_or_assistant(req, res, next){
  if(req.rol === 'administrator' || req.rol === 'assistant') {
    next()
    return
  }
  res.status(400).json({ state: 'F', error: 'Only administrators or assistants can do this action' });
  req.app.locals.logger.warnLog('session_controller.js','Unable to perform the action', 'Only administrators or assistants can do this action');
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
    only_assistant,
    only_administrator
  },
};
