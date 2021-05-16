'use strict';
const faker = require('faker');
faker.locale = "es";
faker.seed(123);
const { uuid } = require('uuidv4');

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
     const storesData = [];

     for (let i = 0; i < 10; i += 1) {
      storesData.push({
        id: uuid(),
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

   return queryInterface.bulkInsert('stores', storesData);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('stores', null, {});
  }
};
