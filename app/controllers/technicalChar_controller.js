const technicalChar = require('../models').technicalChar;

//CREATE
async function  tcreate(req, res) {
    try{
        await technicalChar.create({
            sku: req.body.sku,
            price: req.body.price,
            image: req.body.image,
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
async function  tshow_all(req, res) {
    const technicalChars = await technicalChar.findAll();
    res.json(technicalChars);
};

//READ ONE
async function  tshow(req, res) {
    const technicalChar_id = await technicalChar.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(technicalChar_id);
};

//UPDATE
async function tupdate(req, res) {
    let technicalChar = await technicalChar.findOne({where : {id: req.params.id}})
    try{
        const technicalChar_update = await technicalChar.update({
            key: ((req.body.key)? req.body.key: technicalChar.key),
            value: ((req.body.value)? req.body.value:technicalChar.value)
        },{
            where: {
                id: technicalChar.id
            }
        });
        console.log(technicalChar_update)
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
async function  tdelete(req, res) {
    try{
        const pdestroy = await technicalChar.destroy({ 
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
    show_all: tshow_all,
    show_one: tshow,
    create: tcreate,
    delete: tdelete,
    update: tupdate,
  };
  