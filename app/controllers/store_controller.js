const store = require('../models').store;

//CREATE
async function  screate(req, res) {
    try{
        await store.create({
            name: req.body.name,
            address: req.body.address,
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
async function  sshow_all(req, res) {
    const stores = await store.findAll();
    res.json(stores);
};

//READ ONE
async function  sshow(req, res) {
    const store_id = await store.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(store_id);
};

//DELETE
async function  sdelete(req, res) {
    try{
        const udestroy = await store.destroy({ 
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
    show_all: sshow_all,
    show_one: sshow,
    create: screate,
    delete: sdelete,
  };
  