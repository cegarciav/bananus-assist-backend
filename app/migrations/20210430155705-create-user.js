module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
      },
      rol: {
        type: Sequelize.STRING,
        validate: {
          rolValidator(value) {
            if (value !== 'administrator' && value !== 'supervisor' && value !== 'assistant') {
              throw new Error('Invalid User Rol. Rol must be administrator, supervisor or assistant.');
            }
          },
        },
      },
      token: {
        type: Sequelize.STRING,
      },
      storeId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'stores',
          },
          key: 'id',
        },
        validate: {
          supervisorValidator(value) {
            if (this.rol !== 'supervisor' && value !== null) {
              throw new Error('Invalid association. User must be a supervisor to be able to assign a store');
            }
          },
        },
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
    await queryInterface.dropTable('users');
  },
};
