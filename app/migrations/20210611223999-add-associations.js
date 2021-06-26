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
      setOneToNAssoc(queryInterface, Sequelize, 'stores', 'sale_points'),
      setOneToNAssoc(queryInterface, Sequelize, 'products', 'technical_chars'),
      setOneToNAssoc(queryInterface, Sequelize, 'sale_points', 'central_tablets'),
      setOneToNAssoc(queryInterface, Sequelize, 'central_tablets', 'devices'),
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
      removeOneToNAssoc(queryInterface, 'central_tablets', 'devices', t),
      removeOneToNAssoc(queryInterface, 'sale_points', 'central_tablets', t),
      removeOneToNAssoc(queryInterface, 'products', 'technical_chars', t),
      removeOneToNAssoc(queryInterface, 'stores', 'sale_points', t),
      removeOneToNAssoc(queryInterface, 'stores', 'products', t),
    ])),
};
