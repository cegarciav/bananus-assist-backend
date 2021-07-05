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
    const deviceData = [];
    const centralTabletID = ['03e7e831-04de-4390-b1c7-b806b4d62ccc', '07c295ad-b286-41f7-b2ea-e81a75875d02',
    '1172b616-d861-4737-857e-cd0a87e99634', '2cb158be-8365-4edd-b560-34668b8f05ac',
    '487a49d9-4a8d-4215-8e32-379318e2aebf', '6a4d7bb9-5b65-4a55-b34f-ac1c60627261',
    '840efae5-3847-484e-8f94-b98c56abd229', '87991457-6ade-4417-bf38-69c17dc94865',
    'a70ab67b-1f81-410a-9fcc-89e14b7af05c', 'a7e8b672-70c9-4941-a99d-752e0c295c71',
    'bb463b8b-b76c-4f6a-9726-65ab5730b69b', 'c355d80a-8132-4e57-a3d4-8dd86a5c5d26',
    'e39fbaad-f0e4-4086-99f2-39553f193a46', 'e60545fd-88a8-4017-8f66-11278f755c1c'];

    for (let i = 0; i < 30; i += 1) {
      deviceData.push({
        id: faker.datatype.uuid(),
        central_tabletId: centralTabletID[Math.floor(Math.random() * centralTabletID.length)],
        serialNumber: faker.finance.routingNumber(),
        password: bcrypt.hashSync('123', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('devices', deviceData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('devices', null, {});
  },
};
