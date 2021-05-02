const product = require('../models').product;

//CREATE
async function  pcreate(req, res) {
    try{
        await product.create({
            sku: req.body.sku,
            price: req.body.price,
            image: req.body.image,
            name: req.body.name,
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
async function  pshow_all(req, res) {
    const products = await product.findAll();
    res.json(products);
};

//READ ONE
async function  pshow(req, res) {
    const product_id = await product.findOne({ 
        where: {
            id: req.params.id,
        }
    });
    res.json(product_id);
};

//UPDATE
async function pupdate(req, res) {
    let product = await product.findOne({where : {id: req.params.id}})
    try{
        const product_update = await product.update({
            price: ((req.body.price)? req.body.price: product.price),
            name: ((req.body.name)? req.body.name:product.name),
            image: ((req.body.image)? req.body.image:product.image),
            sku: ((req.body.sky)? req.body.sku: product.sku)
        },{
            where: {
                id: product.id
            }
        });
        console.log(product_update)
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
async function  pdelete(req, res) {
    try{
        const pdestroy = await product.destroy({ 
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
    show_all: pshow_all,
    show_one: pshow,
    create: pcreate,
    delete: pdelete,
    update: pupdate,
  };
  