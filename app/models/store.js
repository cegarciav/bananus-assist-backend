const { Model } = require('sequelize');
const { assistant } = require('.');

async function destroyStoreAssistant(instance) {
  await assistant.destroy({ where: { storeId: instance.id } });
}

module.exports = (sequelize, DataTypes) => {
  class store extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     store:
     *       type: object
     *       required:
     *         - id
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         name:
     *           type: string
     *         address:
     *           type: string
     */
    static associate(models) {
      this.belongsToMany(models.user, { through: models.assistant, as: 'assistants' });
      this.hasMany(models.user, { as: 'supervisors' });
      this.hasMany(models.product);
      this.hasMany(models.sale_point);
      // define association here
    }
  }
  store.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'store',
  });

  store.beforeDestroy(destroyStoreAssistant);

  return store;
};
