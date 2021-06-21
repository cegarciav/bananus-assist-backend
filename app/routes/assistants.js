const express = require('express');

const router = express.Router();
const handlers = require('../controllers/assistant_controller');

// CREATE
router.post('/', handlers.create);
// DELETE
router.delete('/', handlers.delete);

module.exports = router;
