'use strict';
const bcrypt = require('bcrypt');
const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT);
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

     const usersData= [];

    for (let i = 0; i < 15; i += 1) {
      usersData.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

   return queryInterface.bulkInsert('users', usersData);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('users', null, {})
  }
};
