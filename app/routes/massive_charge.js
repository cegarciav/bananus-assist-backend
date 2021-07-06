const express = require('express');

const router = express.Router();
const handlers = require('../controllers/massive_charge_controller');
const { filters } = require('../controllers/session_controller');

// CREATE
router.post('/', filters.only_user, filters.only_administrator, handlers.create);

module.exports = router;
