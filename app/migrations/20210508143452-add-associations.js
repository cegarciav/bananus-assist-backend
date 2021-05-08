'use strict';

/**
 * Set 1 to n association between two models by adding the respective foreign key.
 * @param {Object} queryInterface interface object that interacts with the db.
 * @param {Object} Sequelize sequelize object to define data types.
 * @param {string} nModel model on the n side of the association.
 * @param {string} oneModel model on the 1 side of the association.
 * @return {Promise} promise that resolve when the foreign key is setted.
 */
function setOneToNAssoc(queryInterface, Sequelize, nModel, oneModel){
  return queryInterface.addColumn(
    oneModel,
    nModel + 'Id',
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
    await setOneToNAssoc(queryInterface, Sequelize, 'users', 'stores');
    await setOneToNAssoc(queryInterface, Sequelize, 'stores', 'products');
    await setOneToNAssoc(queryInterface, Sequelize, 'stores', 'sale_points');
    await setOneToNAssoc(queryInterface, Sequelize, 'products', 'technical_chars');
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
