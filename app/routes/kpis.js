const express = require('express');

const router = express.Router();
const handlers = require('../controllers/kpis_controller');

// Get Kpi of one assistant
router.post('/', handlers.single_kpi);
// Get global kpi total calls aceptted
router.get('/', handlers.global_kpi);
// Get total calls;
router.get('/total', handlers.total_kpi);
module.exports = router;
