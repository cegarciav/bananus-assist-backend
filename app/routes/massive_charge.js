const express = require('express');

const router = express.Router();
const handlers = require('../controllers/massive_charge_controller');

// CREATE
router.post('/', handlers.create);


module.exports = router;
