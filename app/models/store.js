const {
  Model,
} = require('sequelize');

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
     *         - name
     *         - address
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         name:
     *           type: string
     *         address:
     *           type: string
     *           unique: true
     */
    static associate(models) {
      this.belongsToMany(models.user, { through: models.assistant, as: 'assistants' });
      this.hasMany(models.user, { as: 'supervisors' });
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

  return store;
};
