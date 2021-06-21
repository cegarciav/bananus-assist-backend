module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'sale_points',
      'department',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    ),

  down: (queryInterface) => queryInterface
    .removeColumn('sale_points', 'department'),
};
