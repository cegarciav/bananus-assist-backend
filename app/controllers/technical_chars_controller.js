const technical_char = require('../models').technical_char;

//CREATE
async function create(req, res) {
    try{
        await technical_char.create({
            key: req.body.key,
            value: req.body.value
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
async function show_all(req, res) {
    const technical_chars = await technical_char.findAll();
    res.json(technical_chars);
};

//READ ONE
async function  show(req, res) {
    const technical_char_id = await technical_char.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(technical_char_id);
};
//UPDATE
async function update(req, res){
    let current_char = await technical_char.findOne({where : {id:req.body.id}})
    if (!current_char){
        return res.json({state: 'F',error: 'Technical characteristic doesnt exist'});
    }
    try{
        await technical_char.update({
            key: ((req.body.key)? req.body.key: current_char.key),
            value: ((req.body.value)? req.body.vale:current_char.value)
        },{where : {id: req.body.id}
        });

        res.json({state: 'OK'});

    } catch (error){
        
        res.json({
            state: 'F',
            error: error,
        });
    }
}
//DELETE
async function  cdelete(req, res) {
    try{
        const udestroy = await technical_char.destroy({ 
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
    show_all: show_all,
    show_one: show,
    create: create,
    update: update,
    delete: cdelete,
  };
  