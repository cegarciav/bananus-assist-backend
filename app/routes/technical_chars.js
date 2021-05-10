"use strict"
const express = require('express');
const router = express.Router();
const handlers = require("../controllers/technical_chars_controller");

//CREATE
router.post("/", handlers.create);
//READ ALL
router.get("/", handlers.show_all);
//READ ONE
router.post("/show", handlers.show_one);
//UPDATE
router.patch("/", handlers.update);
//DELETE
router.delete("/", handlers.delete);

module.exports = router;