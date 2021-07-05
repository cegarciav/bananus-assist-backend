async function setOneToNAssoc(queryInterface, Sequelize, nModel, oneModel) {
  return queryInterface.addColumn(
    oneModel,
    `${nModel.slice(0, -1)}Id`,
    {
      type: Sequelize.UUID,
      references: {
        model: nModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  );
}

async function removeOneToNAssoc(queryInterface, nModel, oneModel, t) {
  return queryInterface.removeColumn(
    oneModel,
    `${nModel.slice(0, -1)}Id`,
    { transaction: t },
  );
}

module.exports = {
  /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  up: async (queryInterface, Sequelize) => (
    Promise.all([
      setOneToNAssoc(queryInterface, Sequelize, 'stores', 'products'),
    ])
  ),

  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  down: async (queryInterface) => queryInterface
    .sequelize.transaction(async (t) => Promise.all([
      removeOneToNAssoc(queryInterface, 'stores', 'products', t),
    ])),
};
