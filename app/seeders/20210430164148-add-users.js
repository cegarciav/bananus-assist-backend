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

    const rolUser = ['administrator', 'supervisor', 'supervisor'];
    const storeIdData = ['3d48dd86-a5c5-4d26-9057-8899840efae5', '5c71ad3d-9ee2-4117-ab61-6d861737c57e', '6ade4177-f386-49c1-bdc9-48650456bade',
      '7bb95b65-a553-434f-ac1c-606272614e6c', '8d215ce3-2379-4318-a2ae-bf079488242c', 'b46bad09-a70a-4b67-b1f8-110a9fcc89e1',
      'b4d62ccc-4a4f-4a61-ba7e-8b67270c9941', 'b98c56ab-d229-4fd5-bd11-603e7e83104d', 'bb463b8b-b76c-4f6a-9726-65ab5730b69b',
      'ddb56034-668b-48f0-9ac0-90be246c355d'];
    const usersData = [];

    for (let i = 0; i < 15; i += 1) {
      usersData.push({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), PASSWORD_SALT),
        rol: ((rolUser[i]) ? rolUser[i] : 'assistant'),
        storeId: ((rolUser[i] === 'supervisor') ? storeIdData[Math.floor(Math.random() * storeIdData.length)] : null),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    usersData.push({
      id: faker.datatype.uuid(),
      name: 'Super Admin',
      email: 'admin@bananus.cl',
      password: bcrypt.hashSync('bananus', PASSWORD_SALT),
      rol: 'administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return queryInterface.bulkInsert('users', usersData);
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
