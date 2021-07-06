const express = require('express');

const router = express.Router();
const handlers = require('../controllers/sale_points_controller');
const { filters } = require('../controllers/session_controller');

// CREATE
router.post('/', filters.only_user, filters.only_administrator, handlers.create);
// READ ALL
router.get('/', filters.only_user, filters.administrator_or_assistant, handlers.show_all);
// READ ONE
router.post('/show', filters.only_user,filters.administrator_or_assistant,handlers.show_one);
// UPDATE
router.patch('/', filters.only_user, filters.only_administrator, handlers.update);
// DELETE
router.delete('/', filters.only_user, filters.only_administrator, handlers.delete);

module.exports = router;
