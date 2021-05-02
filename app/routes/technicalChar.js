"use strict"
const express = require('express');
const router = express.Router();
const handlers = require("../controllers/product_controller");

//CREATE
router.post("/", handlers.create);
//READ ALL
router.get("/", handlers.show_all);
//READ ONE
router.get("/:id", handlers.show_one);
//DELETE
router.delete("/:id", handlers.delete);
//UPDATE
router.patch("/:id", handlers.update);

module.exports = router;