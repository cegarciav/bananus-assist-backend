module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_points', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      storeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'stores',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sale_points');
  },
};
