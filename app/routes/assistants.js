const express = require('express');

const router = express.Router();
const handlers = require('../controllers/assistant_controller');
const call = require('../controllers/kpis_controller').enter;
const { filters } = require('../controllers/session_controller');

// CREATE
router.post('/', handlers.create);
// PATCH
router.patch('/', filters.only_logged, filters.only_user,
  filters.only_assistant, handlers.accept);
// Call entering
router.post('/call',call)
// DELETE
router.delete('/', handlers.delete);

module.exports = router;
