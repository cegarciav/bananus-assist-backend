const express = require('express');

const router = express.Router();
const handlers = require('../controllers/kpis_controller');
const { filters } = require('../controllers/session_controller');

// Get Kpi of one assistant
router.post('/', filters.only_user, filters.only_administrator,handlers.single_kpi);
// Get global kpi total calls aceptted
router.get('/', filters.only_user, filters.only_administrator,handlers.global_kpi);
// Get total calls;
router.get('/total', filters.only_user, filters.only_administrator,handlers.total_kpi);
module.exports = router;