const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class sale_point extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     sale point:
     *       type: object
     *       required:
     *         - id
     *         - department
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         department:
     *           type: string
     */
    static associate(models) {
      this.belongsTo(models.store);
      this.hasMany(models.central_tablet, { foreignKey: 'sale_pointId' });
      // define association here
    }
  }
  sale_point.init({
    department: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'sale_point',
  });
  return sale_point;
};
