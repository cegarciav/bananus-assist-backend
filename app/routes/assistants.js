const express = require('express');

const router = express.Router();
const handlers = require('../controllers/assistant_controller');
const { filters } = require('../controllers/session_controller');

// CREATE
router.post('/', handlers.create);
// PATCH
router.patch('/', filters.only_logged, filters.only_user,
  filters.only_assistant, handlers.accept);
// DELETE
router.delete('/', handlers.delete);

module.exports = router;
