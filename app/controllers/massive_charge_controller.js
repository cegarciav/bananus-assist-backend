const XLSX = require('xlsx');
const { uuid } = require('uuidv4');
const { product } = require('../models');
const { technical_char } = require('../models');

async function create(req, res) {
  if (!req.files) {
    res.status(400).json({ state: 'F', error: 'No file uploaded' });
    return;
  }

  const workbook = XLSX.read(req.files.excel.data, { type: 'buffer' });
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];
  const caracteristicas = workbookSheets[1];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const dataCaracteristicas = XLSX.utils.sheet_to_json(workbook.Sheets[caracteristicas]);

  let succes = 0;
  let failed = 0;
  const object_failed = [];

  await Promise.all(
    dataExcel.map(async (row) => {
      try {
        const last_product = await product.findOne({ where: { sku: row.sku } });
        if (!row.name || !row.sku || !row.price || !row.image) {
          failed += 1;
          object_failed.push(row);
        } else if (last_product) {
          await product.update({
            name: ((row.name) ? row.name : last_product.name),
            sku: ((row.new_sku) ? row.new_sku : last_product.sku),
            price: ((row.price) ? row.price : last_product.price),
            image: ((row.image) ? row.image : last_product.image),
          }, { where: { sku: last_product.sku } });
          succes += 1;
        } else {
          await product.create({
            id: uuid(),
            name: row.name,
            sku: row.sku,
            price: row.price,
            image: row.image,
          });
          succes += 1;
        }
      } catch (e) {
        failed += 1;
        object_failed.push(row);
      }
    }),
  );

  //CARACTERISTICAS
  // await Promise.all(
  //   dataCaracteristicas.map(async (row) => {
  //     try {
  //       const last_product = await technical_char.findOne({
  //          where: { sku: row.sku } ,
  //          include: [
  //           {
  //             model: product,
  //           },
  //         ],
  //         });
  //       console.log(last_product);
  //       if (!row.name || !row.sku || !row.price || !row.image) {
  //         failed += 1;
  //         object_failed.push(row);
  //       } else if (last_product) {
  //         await product.update({
  //           name: ((row.name) ? row.name : last_product.name),
  //           sku: ((row.new_sku) ? row.new_sku : last_product.sku),
  //           price: ((row.price) ? row.price : last_product.price),
  //           image: ((row.image) ? row.image : last_product.image),
  //         }, { where: { sku: last_product.sku } });
  //         succes += 1;
  //       } else {
  //         await product.create({
  //           id: uuid(),
  //           name: row.name,
  //           sku: row.sku,
  //           price: row.price,
  //           image: row.image,
  //         });
  //         succes += 1;
  //       }
  //     } catch (e) {
  //       failed += 1;
  //       object_failed.push(row);
  //     }
  //   }),
  // );

  res.status(200).json({
    succesfully: succes,
    failed,
    failed_products: object_failed,
  });
}

module.exports = {
  create,
};
