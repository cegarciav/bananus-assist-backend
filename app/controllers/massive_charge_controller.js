const XLSX = require('xlsx');
const formidable = require('formidable');
const { product } = require('../models');
const { uuid } = require('uuidv4');


async function create (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var f = files[Object.keys(files)[0]];
    var workbook = XLSX.readFile(f.path);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    const firstRow = dataExcel[0];
    console.log(firstRow.name);
    
    dataExcel.forEach( async (row) => {
      try {        
        const last_product = await product.findOne({ where: { sku: row.sku } });
    
        if (last_product) {
          //res.status(400).json({ state: 'F', error: 'That sku already exists' });
          await product.update({
            name: ((row.name) ? row.name : last_product.name),
            sku: ((row.new_sku) ? row.new_sku : last_product.sku),
            price: ((row.price) ? row.price : last_product.price),
            image: ((row.image) ? row.image : last_product.image),
          }, { where: { sku: last_product.sku } });
          return;
        }
    
        await product.create({
          id: uuid(),
          name: row.name,
          sku: row.sku,
          price: row.price,
          image: row.image,
        });
        return;
      } catch (error) {
        console.log('error');
      }
    })  
  });
  res.send('listo');
}

module.exports = {
  create,
};
  