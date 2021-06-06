module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assistants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
      },
      storeId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'stores',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
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
    await queryInterface.dropTable('assistants');
  },
};
