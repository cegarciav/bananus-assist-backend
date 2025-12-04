module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn(
      'users',
      'rol',
      'role',
    );
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn(
      'users',
      'role',
      'rol',
    );
  },
};
