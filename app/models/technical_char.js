const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class technical_char extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     technical char:
     *       type: object
     *       required:
     *         - id
     *         - key
     *         - value
     *         - productId
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         key:
     *           type: string
     *         value:
     *           type: string
     *         productId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing product
     */
    static associate(models) {
      this.belongsTo(models.product);
      // define association here
    }
  }
  technical_char.init({
    key: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'technical_char',
  });
  return technical_char;
};
