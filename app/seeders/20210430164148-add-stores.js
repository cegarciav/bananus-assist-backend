'use strict';
const faker = require('faker');
faker.locale = 'es';
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
     const assistantIdData = ['37c57ecd-0a87-4e99-a34b-46bad09a70ab','44a60dea-0f27-4ce0-8b4f-cddb5ff6adb5','5384784e-4f94-4b98-856a-bd229fd5fd11',
     '5631f7ea-54ae-4473-8565-6ecdbb7f86d3','8bb1ef91-31b8-4c73-ad67-dcc3252f8a8c','8f755c1c-9337-49b4-ae39-fbaadf0e4086',
     'ad7e645f-d941-401e-9dc4-2851f1ed567a','ca607c29-5adb-4286-9f73-2eae81a75875','ccc4a4fa-613a-47e8-b672-70c9941e99d7',
     'e757e108-bd76-4790-8065-7fc9c529c372','f05ac090-be24-46c3-95d8-0a8132e57a3d','f94a3416-e70e-4790-be85-8a057eeb310b'];
     const supervisorIdData = ['06272614-e6ce-4bf8-8799-14576ade4177','94a8d215-ce32-4379-b18e-2aebf0794882'];

     for (let i = 0; i < 10; i += 1) {
      storesData.push({
        id: faker.datatype.uuid(),
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        userId: [supervisorIdData[Math.floor(Math.random() * supervisorIdData.length)]],
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
