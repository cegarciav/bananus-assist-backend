const { uuid } = require('uuidv4');
const { product, technical_char } = require('../models');

// CREATE
async function create(req, res) {
  try {
    if (!req.body.name || !req.body.sku || !req.body.price || !req.body.image) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const last_product = await product.findOne({ where: { sku: req.body.sku } });

    if (last_product) {
      res.status(400).json({ state: 'F', error: 'That sku already exists' });
      return;
    }

    await product.create({
      id: uuid(),
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      image: req.body.image,
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// READ ALL
async function show_all(req, res) {
  try {
    const products = await product.findAll();
    for (let row of products){
      row.dataValues.technical_chars = await search_tech_chars(row.dataValues.id);
    }
    res.status(200).json(products);
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// READ ONE
async function show(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    let current_product = await product.findOne({ where: { sku: req.body.sku } });

    if (!current_product) {
      res.status(400).json({ state: 'F', error: "Product doesn't exist" });
      return;
    }
    current_product.dataValues.technical_chars = await search_tech_chars(current_product.id);
    res.status(200).json(current_product);
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}

// UPDATE
async function update(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    if (req.body.new_sku) {
      const other_product = await product.findOne({ where: { sku: req.body.new_sku } });
      if (other_product) {
        res.status(400).json({ state: 'F', error: 'This sku already exists' });
        return;
      }
    }
    const current_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!current_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesnt exist" });
      return;
    }

    await product.update({
      name: ((req.body.name) ? req.body.name : current_product.name),
      sku: ((req.body.new_sku) ? req.body.new_sku : current_product.sku),
      price: ((req.body.price) ? req.body.price : current_product.price),
      image: ((req.body.image) ? req.body.image : current_product.image),
    }, { where: { sku: current_product.sku } });

    res.status(200).json({ state: 'OK' });
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}
// DELETE
async function pdelete(req, res) {
  try {
    if (!req.body.sku) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const curr_product = await product.findOne({ where: { sku: req.body.sku } });
    if (!curr_product) {
      res.status(400).json({ state: 'F', error: "Product's sku doesn't exist" });
      return;
    }

    await product.destroy({
      where: {
        sku: req.body.sku,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
    return;
  } catch{
    res.status(500).json({
      state: 'F',
      error: "Internal server error",
    });
  }
}
async function search_tech_chars(product_id){
  let technical_chars = await technical_char.findAll(
    {
      attributes:["id", "key", "value", "productId"],
    where: {
      productId: product_id
    }})
  return technical_chars
}

module.exports = {
  show_all,
  show_one: show,
  create,
  update,
  delete: pdelete,
};
