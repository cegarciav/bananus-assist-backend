const express = require('express');

const router = express.Router();
const handlers = require('../controllers/session_controller');

const { filters } = handlers;

router.post('/', filters.only_unlogged, handlers.log_in);
router.delete('/', filters.only_logged, handlers.log_out);

module.exports = router;
