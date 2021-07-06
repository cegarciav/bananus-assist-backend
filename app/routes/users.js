const express = require('express');
const { filters } = require('../controllers/session_controller');

const router = express.Router();
const handlers = require('../controllers/user_controller');

// CREATE
router.post('/', filters.only_user, filters.only_administrator,handlers.create);
// READ ALL
router.get('/', filters.only_user, filters.only_administrator, handlers.show_all);
// READ ONE
router.post('/show', handlers.show_one);
// UPDATE
router.patch('/', handlers.update);
// DELETE
router.delete('/', filters.only_user, filters.only_administrator,handlers.delete);

module.exports = router;
