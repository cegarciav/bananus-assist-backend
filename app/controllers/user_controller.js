const user = require('../models').user;

//CREATE
async function  ucreate(req, res) {
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
};

//READ ALL
async function  ushow_all(req, res) {
    const users = await user.findAll();
    res.json(users);
};

//READ ONE
async function  ushow(req, res) {
    const user_id = await user.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(user_id);
};

//DELETE
async function  udelete(req, res) {
    try{
        const udestroy = await user.destroy({ 
            where: {
                id: req.params.id,
            }
        });
        res.json({
            state: 'OK'
        });
    } catch (error){
        res.json({
            state: 'F',
            error: error,
        });
    }
    
};

module.exports = {
    show_all: ushow_all,
    show_one: ushow,
    create: ucreate,
    delete: udelete,
  };
  