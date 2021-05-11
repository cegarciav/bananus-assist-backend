const technical_char = require('../models').technical_char;

//CREATE
async function create(req, res) {
    try {
        if(!req.body.key || !req.body.value || !req.body.productId){
            res.status(400).json({state:"F", error: "Invalid fields"});
            return;
        }
        await technical_char.create({
            key: req.body.key,
            value: req.body.value,
            productId: req.body.productId
        });
        res.status(201).json({
            state: 'OK'
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }
}

//READ ALL
async function show_all(req, res) {
    try {
        const technical_chars = await technical_char.findAll();
        res.status(200).json(technical_chars);
        return;
    }
    catch (error) {
        res.status(500).json({
            state: 'F',
            error: error,
        });
        return;
    }
}

//READ ONE
async function show(req, res) {
    try {
        if (!req.body.id){
            res.status(400).json({state:"F", error:"Invalid fields"});
            return;
        }
        const technical_char_id = await technical_char.findOne({
            where: {id: req.body.id}});
        if(!technical_char_id){
            res.status(400).json({state:"F", error:"Technical characteristic doesn't exist"});
            return;
        }
        res.status(200).json(technical_char_id);
        return;
    }
    catch (error) {
        res.status(500).json({
            state: 'F',
            error: error,
        });
        return;
    }
}

//UPDATE
async function update(req, res){
    try {
        if (!req.body.id){
            res.status(400).json({state:"F", error:"Invalid fields"});
            return;
        }
        let current_char = await technical_char.findOne({where : {id:req.body.id}});
        if (!current_char){
            res.status(400).json({state: 'F',error: 'Technical characteristic doesn\'t exist'});
            return;
        }
        await technical_char.update({
            key: ((req.body.key)? req.body.key: current_char.key),
            value: ((req.body.value)? req.body.vale:current_char.value)
        },{where : {id: req.body.id}
        });

        res.status(200).json({state: 'OK'});
        return;
    }
    catch (error) {
        res.status(500).json({
            state: 'F',
            error: error,
        });
        return;
    }
}

//DELETE
async function cdelete(req, res) {
    try {
        if (!req.body.id){
            res.status(400).json({state:"F", error:"Invalid fields"});
            return;
        }
        let current_char = await technical_char.findOne({where : {id:req.body.id}});
        if (!current_char){
            res.status(400).json({state: 'F',error: 'Technical characteristic doesn\'t exist'});
            return;
        }

        const udestroy = await technical_char.destroy({ 
            where: {
                id: req.body.id,
            }
        });
        res.status(200).json({
            state: 'OK'
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }
}

module.exports = {
    show_all: show_all,
    show_one: show,
    create: create,
    update: update,
    delete: cdelete,
};
