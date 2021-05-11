const sale_point = require('../models').sale_point;

//CREATE
async function  spcreate(req, res) {
    try {
        if (!req.body.storeId){
            res.status(400).json({state: "F", error: "Invalid fields"});
            return;
        }
        await sale_point.create({
            storeId: req.body.storeId
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
        return;
    }
};

//READ ALL
async function  spshow_all(req, res) {
    try {
        const sale_points = await sale_point.findAll();
        res.status(200).json(sale_points);
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
async function  spshow(req, res) {
    try {
        if (!req.body.id){
            return res.status(400).json({state:"F", error: "Invalid fields"})
        }
        let sale_point_id = await sale_point.findOne({ 
            where: {id: req.body.id,}});
    
        if(!sale_point_id){
            return res.status(400).json({state:"F", error: "Sale point doesn't exist"})
        }
        res.status(200).json(sale_point_id);
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
async function spdelete(req, res) {
    try {
        if(!req.body.id){
            return res.status(400).json({state:"F", error: "Invalid fields"})
        }
        let curr_sale_point = await sale_point.findOne({where: { id:req.body.id}})
        if (!curr_sale_point){
            return res.status(400).json({state:"F", error: "Sale's id doesn't exist"})
        }

        const udestroy = await sale_point.destroy({ 
            where: {
                id: req.body.id,
            }
        });
        res.status(200).json({
            state: 'OK'
        });
    }
    catch (error) {
        res.status(500).json({
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
  