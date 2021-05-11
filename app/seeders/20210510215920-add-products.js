'use strict';
const faker = require('faker');
faker.locale = "es";
faker.seed(123);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const productsData = [];

    for (let i = 0; i < 40; i += 1) {
      productsData.push({
        name: faker.commerce.productName(),
        sku: faker.datatype.number(),
        price: faker.commerce.price(),
        image: faker.image.fashion(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

   return queryInterface.bulkInsert('products', productsData);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('products', null, {});
  }
};
