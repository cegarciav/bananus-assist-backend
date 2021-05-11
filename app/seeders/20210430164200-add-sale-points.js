'use strict';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

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
     const sale_pointsData = [];

     for (let i = 0; i < 45; i += 1) {
      sale_pointsData.push({
        //id_store: getRandomArbitrary(1, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

   return queryInterface.bulkInsert('sale_points', sale_pointsData);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     await queryInterface.bulkDelete('sale_points', null, {});
  }
};
