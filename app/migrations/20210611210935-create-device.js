module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('devices', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      token: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      central_tabletId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'central_tablets',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('devices');
  },
};
