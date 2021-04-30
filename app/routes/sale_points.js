"use strict"
const express = require('express');
const router = express.Router();
const handlers = require("../controllers/sale_points_controller");

//CREATE
router.post("/", handlers.create);
//READ ALL
router.get("/", handlers.show_all);
//READ ONE
router.get("/:id", handlers.show_one);
//DELETE
router.delete("/:id", handlers.delete);

module.exports = router;