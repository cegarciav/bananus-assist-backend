const express = require('express');

const router = express.Router();
const handlers = require('../controllers/session_controller');

const { filters } = handlers;

router.post('/', filters.only_unlogged, handlers.log_in_user);
router.post('/devices', filters.only_unlogged, handlers.log_in_devices);
router.delete('/devices', filters.only_logged, filters.only_device, handlers.log_out_devices);
router.delete('/', filters.only_logged, filters.only_user, handlers.log_out_user);
module.exports = router;
