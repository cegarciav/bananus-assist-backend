const faker = require('faker');

faker.locale = 'es';
faker.seed(123);

module.exports = {
  up: async (queryInterface) => {
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
    /* const supervisorIdData = [
      '06272614-e6ce-4bf8-8799-14576ade4177',
      '94a8d215-ce32-4379-b18e-2aebf0794882']; */

    for (let i = 0; i < 10; i += 1) {
      storesData.push({
        id: faker.datatype.uuid(),
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('stores', storesData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('stores', null, {});
  },
};
