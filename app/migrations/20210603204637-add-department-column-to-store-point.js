module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'sale_points',
      'department',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    ),

  down: async (queryInterface) => queryInterface
    .removeColumn('sale_points', 'department'),
};
