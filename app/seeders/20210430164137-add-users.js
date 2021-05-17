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
    const usersData = [];

    for (let i = 0; i < 15; i += 1) {
      usersData.push({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), PASSWORD_SALT),
        rol: ((rolUser[i]) ? rolUser[i] : 'assistant'),
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
