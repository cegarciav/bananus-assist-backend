const product = require('../models').product;

//CREATE
async function create(req, res) {
    if (!req.body.name || !req.body.sku || !req.body.price || !req.body.image){
        return res.status(400).json({state: "F", error:"Invalid fields"})
    }
    
    const last_product = await product.findOne({where: {sku: req.body.sku}})
    
    if(last_product){
        return res.status(400).json({state: "F", error: "That sku already exists"})
    }
    try{
        await product.create({
            name: req.body.name,
            sku: req.body.sku,
            price: req.body.price,
            image: req.body.image
        });
        res.status(201).json({
            state: 'OK'
        });
    } catch(error){
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }
};

//READ ALL
async function  show_all(req, res) {
    const products = await product.findAll();
    res.status(200).json(products);
};

//READ ONE
async function  show(req, res) {
    if (!req.body.sku){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }
    const current_product = await product.findOne({ 
        where: {
            sku: req.body.sku
        }
    });
    res.status(200).json(current_product);
};
//UPDATE
async function update(req, res) {
    if (!req.body.sku){
        return res.status(400).json({state:"F", error: "Invalid fields"})
    }
    if (req.body.new_sku){
        let other_product = await product.findOne({where: {sku: req.body.new_sku}})
        if (other_product){
            return res.status(400).json({state: "F", error: "This sku already exists"})
        }
    }
    let current_product = await product.findOne({where: {sku: req.body.sku}})
    if (!current_product){
        return res.status(400).json({state: 'F',error: "Product's sku doesnt exist"});
    }
    try{
        await product.update({
            name: ((req.body.name)? req.body.name: current_product.name),
            sku: ((req.body.new_sku)? req.body.new_sku:current_product.sku),
            price: ((req.body.price)? req.body.price:current_product.price),
            image:((req.body.image)? req.body.image:current_product.image)
        },{where: {sku: current_product.sku}
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
async function pdelete(req, res) {
    if (!req.body.sku){
        return res.status(400).json({state: "F", error: "Invalid fields"})
    }
    let curr_product = await product.findOne({where:{sku: req.body.sku}})
    if (!curr_product){
        return res.status(400).json({state:"F", error:"Product's sku doesn't exist"})
    }

    try{
        const destroy = await product.destroy({ 
            where: {
                sku: req.body.sku,
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
    show_all: show_all,
    show_one: show,
    create: create,
    update: update,
    delete: pdelete,
  };
  