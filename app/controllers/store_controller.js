const store = require('../models').store;

//CREATE
async function  screate(req, res) {
    if(!req.body.name || !req.body.address){
        return res.status(400).json({state:"F", error: "Invalid Fields"})
    }
    let last_store = store.findOne({where:{address: req.body.address}});

    if (last_store){
        return res.status(400).json({state:"F", error: "There are other store in the same address"})
    }
    try{
        await store.create({
            name: req.body.name,
            address: req.body.address,
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
async function  sshow_all(req, res) {
    const stores = await store.findAll();
    res.status(200).json(stores);
};

//READ ONE
async function  sshow(req, res) {
    if(!req.body.address){
        return res.status(400).json({state:"F", error:"Invalid fields"})
    }
    let current_store = await store.findOne({where : {address: req.body.address}})
    if (!current_store){
        return res.status(400).json({state: 'F',error: 'Store address doesnt exist'});
    }
    res.status(200).json(current_store);
};

//DELETE
async function  sdelete(req, res) {
    if(!req.body.address){
        return res.status(400).json({state:"F", error:"Invalid fields"})
    }

    let current_store = await store.findOne({where : {address: req.body.address}})
    
    if (!current_store){
        return res.status(400).json({state: 'F',error: 'Store adress doesnt exist'});
    }
    try{
        const udestroy = await store.destroy({ 
            where: {
                address: req.body.address,
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

 //UPDATE
async function update(req, res){
    if(!req.body.address){
        return res.status(400).json({state:"F", error:"Invalid fields"})
    }

    let current_store = await store.findOne({where : {address: req.body.address}})
    
    if (!current_store){
        return res.status(400).json({state: 'F',error: 'Store address doesnt exist'});
    }

    let last_store = await store.findOne({where: {address: req.body.new_address}});
    
    if (req.body.new_address){
        if (last_store){
            return res.status(400).json({state:"F", error: "This address already exist"})
        }
    }

    try{
        await store.update({
            name: ((req.body.name)? req.body.name: current_store.name),
            address: ((req.body.new_address)? req.body.new_address:current_store.address)
        },{where : {address: req.body.address}
        });

        res.status(200).json({state: 'OK'});

    } catch (error){
        
        res.status(500).json({
            state: 'F',
            error: error,
        });
    }
}

module.exports = {
    show_all: sshow_all,
    show_one: sshow,
    create: screate,
    update: update,
    delete: sdelete,
  };
  