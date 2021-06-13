require('dotenv').config();
const jwt = require('jsonwebtoken');
const { user } = require('../models');

async function set_middleware(req, res, next) {
  req.logged = false;
  if (req.headers.token) {
    let curr_user;
    try{
      curr_user = await user.findOne({ where: { token: req.headers.token } });
    } catch {
      res.status(500).json({state:"F", error:"Internal server error"})
      return;
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
  }
  return next();
}

async function log_in(req, res) {
  try{
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ state: 'F', error: 'Invalid fields' });
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
      return res.status(200).json({ state: 'OK', token });
    }
    return res.status(400).json({ state: 'F', error: 'Invalid email or password' });
  } catch{
    res.status(500).json({state: "F", error: "Internal server error"})
    return;
  }
}

async function log_out(req, res) {
  try {
    await user.update({ token: null }, { where: { email: req.email } });
    return res.status(200).json({ state: 'OK' });
  } catch{
    return res.status(500).json({ state: 'F', error: "Internal server error" });
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
module.exports = {
  check_session: set_middleware,
  log_in,
  log_out,
  filters: {
    only_logged,
    only_unlogged,
  },
};
