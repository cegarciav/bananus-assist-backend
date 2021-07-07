const bcrypt = require('bcrypt');

const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT, 10);
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
    const centralTabletData = [];
    const salePointIdData = [
      '017cf661-1278-4f75-9c1c-93379b46e39f', '057eeb31-0b6e-458d-b07e-0a8e899cd555',
      '0f528728-9644-4a60-9ea0-f27ce0cb4fcd', '11a0bea8-0349-47f4-bc92-890f8e0320cf',
      '13f5f19e-073c-4c7e-b765-e4f191afdce2', '372e55d4-874e-4f2d-a5cf-df16aa96a401',
      '4b426920-f017-4ad7-a645-fd94101e9dc4', '58be8365-eddb-4560-b466-8b8f05ac090b',
      '5fc7ae03-8bd2-4992-88dc-614de25856c3', '6272614e-6ceb-4f88-b991-4576ade4177f',
      '66c65631-f7ea-454a-a473-45656ecdbb7f', '6b198a7b-aa87-4070-8b0b-1f8e772af7c3',
      '6bad09a7-0ab6-47b1-b811-0a9fcc89e14b', '6c1aa839-72fd-40e2-a4cf-fef2cf6c183e',
    ];

    for (let i = 0; i < 14; i += 1) {
      centralTabletData.push({
        id: faker.datatype.uuid(),
        sale_pointId: salePointIdData[i],
        serialNumber: faker.finance.routingNumber(),
        password: bcrypt.hashSync('123', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('central_tablets', centralTabletData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('central_tablets', null, {});
  },
};
