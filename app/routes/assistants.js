const express = require('express');

const router = express.Router();
const handlers = require('../controllers/assistant_controller');

// CREATE
router.post('/', handlers.create);
// PATCH
router.patch('/', handlers.accept);
// DELETE
router.delete('/', handlers.delete);
// Get Kpi of one assistant
router.post('/kpi', handlers.kpi)
// Get global kpi
router.get('/kpi', handlers.kpi_globally)
module.exports = router;