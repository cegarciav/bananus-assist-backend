const sale_point = require('../models').sale_points;

//CREATE
async function  spcreate(req, res) {
    try{
        await sale_point.create({
            id_store: req.body.id_store,
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
async function  spshow_all(req, res) {
    const sale_points = await sale_point.findAll();
    res.json(sale_points);
};

//READ ONE
async function  spshow(req, res) {
    const sale_point_id = await sale_point.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(sale_point_id);
};

//DELETE
async function  spdelete(req, res) {
    try{
        const udestroy = await sale_point.destroy({ 
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
    show_all: spshow_all,
    show_one: spshow,
    create: spcreate,
    delete: spdelete,
  };
  