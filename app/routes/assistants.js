const express = require('express');

const router = express.Router();
const handlers = require('../controllers/assistant_controller');
const filters = require('../controllers/session_controller').filters;

// CREATE
router.post('/', handlers.create);
// PATCH
router.patch('/', filters.only_logged, filters.only_user, 
filters.only_assistant, handlers.accept);
// DELETE
router.delete('/', handlers.delete);
// Get Kpi of one assistant
router.post('/kpi', handlers.kpi)
// Get global kpi
router.get('/kpi', handlers.kpi_globally)
module.exports = router;