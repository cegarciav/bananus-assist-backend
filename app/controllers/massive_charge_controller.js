const XLSX = require('xlsx');
const formidable = require('formidable');
const { product } = require('../models');
const { uuid } = require('uuidv4');


async function create (req, res) {
  if(!req.files){
    res.status(400).json({ state: 'F', error: 'No file uploaded' });
    return;
  }

  var workbook = XLSX.read(req.files.excel.data, {type:'buffer'});
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const firstRow = dataExcel[0];
  console.log(firstRow)
  
  var succes = 0;
  var failed = 0;
  var object_failed = [];

  console.log("1")
  console.log(dataExcel)
  for (const row of dataExcel){
    console.log("2")
    try {        
      const last_product = await product.findOne({ where: { sku: row.sku } });
      if(!row.name || !row.sku || !row.price || !row.image) {
        failed += 1;
        object_failed.push(row);
      } else{
        if (last_product) {
          //res.status(400).json({ state: 'F', error: 'That sku already exists' });
          await product.update({
            name: ((row.name) ? row.name : last_product.name),
            sku: ((row.new_sku) ? row.new_sku : last_product.sku),
            price: ((row.price) ? row.price : last_product.price),
            image: ((row.image) ? row.image : last_product.image),
          }, { where: { sku: last_product.sku } });
          succes += 1;
        } else{
          await product.create({
            id: uuid(),
            name: row.name,
            sku: row.sku,
            price: row.price,
            image: row.image,
          });
          succes += 1;
        }
      }
    } catch (error) {
      failed += 1;
      object_failed.push(row);
      console.log('error');
    }
  }

  res.status(200).json({"succesfully": succes, "failed": failed , "failed_products": object_failed 

  })
}

module.exports = {
  create,
};
  