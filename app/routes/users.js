"use strict"
const express = require('express')

const router = express.Router();

const Models = require('../models');
const user = Models.user;

const PERMITED_FIELD = [
    'name',
    'password',
    'email'
];

//CREATE
router.route('/').post( async(req, res) => {
    console.log(req.body);
    try{
        await user.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        });
        res.json({
            state: 'OK'
        });
    } catch(error){
        res.json({
            state: 'F',
            error: error,
        });
    }
});

//READ ALL
router.route('/').get( async(req, res) => {
    const users = await user.findAll();
    res.json(users);
});

//READ ONE
router.route('/:id').get( async(req, res) => {
    const user_id = await user.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(user_id);
});




module.exports = router;