const XLSX = require('xlsx');
const { uuid } = require('uuidv4');
const {
  product,
  technical_char,
  payment_method,
  available_payment_method,
} = require('../models');

async function create(req, res) {
  if (!req.files) {
    res.status(400).json({ state: 'F', error: 'No file uploaded' });
    req.app.locals.logger.errorLog('massive_charge_controller.js','Unable to perform a massive charge of products', 'No file uploaded');
    return;
  }

  const workbook = XLSX.read(req.files.excel.data, { type: 'buffer' });
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];
  const characteristics = workbookSheets[1];
  const paymentMethods = workbookSheets[2];
  const dataProducts = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const dataCharacteristics = XLSX.utils.sheet_to_json(workbook.Sheets[characteristics]);
  const dataPaymentMethods = XLSX.utils.sheet_to_json(workbook.Sheets[paymentMethods]);

  let success = 0;
  let failed = 0;
  const object_failed = [];

  await Promise.all(
    dataProducts.map(async (row, index) => {
      try {
        const last_product = await product.findOne({ where: { sku: row.sku } });
        if (!row.name || !row.sku || !row.price || !row.image) {
          failed += 1;
          object_failed.push({
            key: index + 2,
            type: 'product',
          });
        } else if (last_product) {
          await product.update({
            name: ((row.name) ? row.name : last_product.name),
            sku: ((row.new_sku) ? row.new_sku : last_product.sku),
            price: ((row.price) ? row.price : last_product.price),
            image: ((row.image) ? row.image : last_product.image),
          }, { where: { sku: last_product.sku } });
          success += 1;
        } else {
          await product.create({
            id: uuid(),
            name: row.name,
            sku: row.sku,
            price: row.price,
            image: row.image,
          });
          success += 1;
        }
      } catch (e) {
        req.app.locals.logger.errorLog('massive_charge_controller.js','Unable to load a product', e);
        failed += 1;
        object_failed.push({
          key: index + 2,
          type: 'product',
        });
      }
    }),
  );

  // Characteristics

  await Promise.all(
    dataCharacteristics.map(async (row, index) => {
      try {
        const last_product = await product.findOne({
          where: { sku: row.sku },
        });
        const last_key = await technical_char.findOne({
          where: { key: row.key, productId: last_product.id },
        });
        if (!row.key || !row.value) {
          failed += 1;
          object_failed.push({
            key: index + 2,
            type: 'tech_char',
          });
        } else if (last_product && last_key) {
          await technical_char.update({
            value: ((row.value) ? row.value : last_key.value),
          }, { where: { key: last_key.key, productId: last_product.id } });
          success += 1;
        } else if (!last_product && last_key) {
          failed += 1;
          object_failed.push({
            key: index + 2,
            type: 'tech_char',
          });
        } else {
          await technical_char.create({
            id: uuid(),
            key: row.key,
            value: row.value,
            productId: last_product.id,
          });
          success += 1;
        }
      } catch (e) {
        req.app.locals.logger.errorLog('massive_charge_controller.js','Unable to load a technical characteristic of a product', e);
        failed += 1;
        object_failed.push({
          key: index + 2,
          type: 'tech_char',
        });
      }
    }),
  );

  // Payment methods

  await Promise.all(
    dataPaymentMethods.map(async (row, index) => {
      try {
        const lastProduct = await product.findOne({
          where: { sku: row.sku },
        });
        const lastMethod = await payment_method.findOne({
          where: { name: row.paymentMethod },
        });
        if (!lastProduct || !lastMethod) {
          failed += 1;
          object_failed.push({
            key: index + 2,
            type: 'payment_method',
          });
        } else {
          await available_payment_method.create({
            payment_methodId: lastMethod.id,
            productId: lastProduct.id,
          });
          success += 1;
        }
      } catch (e) {
        req.app.locals.logger.errorLog('massive_charge_controller.js','Unable to load a payment method of a product', e);
        failed += 1;
        object_failed.push({
          key: index + 2,
          type: 'payment_method',
        });
      }
    }),
  );

  res.status(200).json({
    successfully: success,
    failed,
    failed_products: object_failed,
  });
  req.app.locals.logger.debugLog('massive_charge_controller.js',`Successfully massive charge of the products`, 'OK');
}

module.exports = {
  create,
};
