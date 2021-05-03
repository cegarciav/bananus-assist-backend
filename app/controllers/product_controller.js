const product = require('../models').product;

//CREATE
async function create(req, res) {
    try{
        await product.create({
            name: req.body.name,
            sku: req.body.sku,
            price: req.body.price,
            image: req.body.image
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
async function  show_all(req, res) {
    const products = await product.findAll();
    res.json(products);
};

//READ ONE
async function  show(req, res) {
    const current_product = await product.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(current_product);
};
//UPDATE
async function update(req, res) {
    let current_product = await product.findOne({where : {sku: req.body.sku}})
    if (!current_product){
        return res.json({state: 'F',error: 'product sku doesnt exist'});
    }
    try{
        await product.update({
            name: ((req.body.name)? req.body.name: current_product.name),
            sku: ((req.body.new_sku)? req.body.new_sku:current_product.sku),
            price: ((req.body.price)? req.body.price:current_product.price),
            image:((req.body.image)? req.body.image:current_product.image)
        },{where: {sku: current_product.sku}
        });

        res.json({state: 'OK'});
        
    } catch (error){
        res.json({
            state: 'F',
            error: error,
        });
    }

};
//DELETE
async function pdelete(req, res) {
    try{
        const destroy = await product.destroy({ 
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
    delete: pdelete,
  };
  