const user = require('../models').user;
const { uuid } = require('uuidv4');


//CREATE
async function  ucreate(req, res) {
    if(!req.body.name || !req.body.password || !req.body.email){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }
    let current_user = await user.findOne({where:{email: req.body.email}})
    if (current_user){
        return res.status(400).json({state:"F", error:"Email already in use"})
    }
    try{
        await user.create({
            id: uuid(),
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        });
        res.status(201).json({
            state: 'OK',
        });
    } catch(error){
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }
};

//READ ALL
async function  ushow_all(req, res) {
    const users = await user.findAll();
    res.status(200).json(users);
};

//READ ONE
async function  ushow(req, res) {
    if (!req.body.email){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }
    let current_user = await user.findOne({where : {email: req.body.email}})
    if (!current_user){
        return res.status(400).json({state: 'F',error: 'User email doesnt exist'});
    }
    res.status(200).json(current_user);
};

//UPDATE
async function update(req, res) {
    if(!req.body.email){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }

    let current_user = await user.findOne({where : {email: req.body.email}})
    
    if (!current_user){
        return res.status(400).json({state: 'F',error: "User's email doesnt exist"});
    }
    if(req.body.new_email){
        let last_user = await user.findOne({where: { email: req.body.new_email}})
        if (last_user){
            return res.status(400).json({state:"F", error: "New email already in use"})
        }
    }
    try{
        const user_update = await user.update({
            name: ((req.body.name)? req.body.name: current_user.name),
            password: ((req.body.password)? req.body.password:current_user.password),
            email: ((req.body.new_email)? req.body.new_email:current_user.email)
        },{where: {email: current_user.email}
        });

        res.status(200).json({state: 'OK'});
        
    } catch (error){
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }

};
//DELETE
async function  udelete(req, res) {
    if(!req.body.email){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }
    let current_user = await user.findOne({where : {email: req.body.email}})
    if (!current_user){
        return res.status(400).json({state: 'F',error: 'User email doesnt exist'});
    }
    try{
        const udestroy = await user.destroy({ 
            where: {
                email: req.body.email,
            }
        });
        res.status(200).json({
            state: 'OK'
        });
    } catch (error){
        res.status(500).json({
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
  