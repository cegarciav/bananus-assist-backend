module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('central_tablets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      serialNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      sale_pointId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'sale_points',
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
    await queryInterface.dropTable('central_tablets');
  },
};
