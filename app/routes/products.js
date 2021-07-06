const express = require('express');

const router = express.Router();
const handlers = require('../controllers/product_controller');
const filters = require('../controllers/session_controller').filters;

// CREATE
router.post('/', handlers.create);
// READ ALL
router.get('/', handlers.show_all);
// READ ONE
router.post('/show', handlers.show_one);
// UPDATE
router.patch('/', handlers.update);
// DELETE
router.delete('/', filters.only_user, filters.only_administrator, handlers.delete);

module.exports = router;
