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
    const current_user = await user.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(current_user);
};
//UPDATE
async function update(req, res) {
    let current_user = await user.findOne({where : {email: req.body.email}})
    if (!current_user){
        return res.json({state: 'F',error: 'User email doesnt exist'});
    }
    try{
        const user_update = await user.update({
            name: ((req.body.name)? req.body.name: current_user.name),
            password: ((req.body.password)? req.body.password:current_user.password),
            email: ((req.body.new_email)? req.body.new_email:current_user.email)
        },{
            where: {
                email: current_user.email
            }
        });
        console.log(user_update)
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
    update: update,
    delete: udelete,
  };
  