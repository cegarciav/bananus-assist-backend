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
    const technicalCharData = [];

    for (let i = 0; i < 80; i += 1) {
      technicalCharData.push({
        key: faker.commerce.productAdjective(),
        value: faker.commerce.productDescription(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

   return queryInterface.bulkInsert('technical_chars', technicalCharData);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('technical_chars', null, {});
  }
};
