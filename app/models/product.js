const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     product:
     *       type: object
     *       required:
     *         - id
     *         - name
     *         - sku
     *         - price
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         name:
     *           type: string
     *         sku:
     *           type: integer
     *           unique: true
     *         price:
     *           type: integer
     *           minimum: 0
     *         image:
     *           type: string
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.store);
      this.hasMany(models.technical_char);
    }
  }
  product.init({
    name: DataTypes.STRING,
    sku: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};
