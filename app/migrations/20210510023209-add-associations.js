'use strict';

async function setOneToNAssoc(queryInterface, Sequelize, nModel, oneModel){
  return queryInterface.addColumn(
    oneModel,
    nModel.slice(0,-1) + 'Id',
    {
      type: Sequelize.INTEGER,
      references: {
        model: nModel,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  )
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    return(Promise.all([setOneToNAssoc(queryInterface, Sequelize, 'users', 'stores'),
    setOneToNAssoc(queryInterface, Sequelize, 'stores', 'products'),
    setOneToNAssoc(queryInterface, Sequelize, 'stores', 'sale_points'),
    setOneToNAssoc(queryInterface, Sequelize, 'products', 'technical_chars')]))
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
