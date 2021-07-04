const express = require('express');

const router = express.Router();
const handlers = require('../controllers/kpis_controller');

// Get Kpi of one assistant
router.post('/', handlers.single_kpi);
// Get global kpi
router.get('/', handlers.global_kpi);
module.exports = router;