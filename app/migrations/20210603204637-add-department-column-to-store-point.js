module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'sale_points',
      'department',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sale_points', 'department');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
  }
};