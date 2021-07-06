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
     *         - image
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
     *           format: uri
     */
    static associate(models) {
      // define association here
      this.hasMany(models.technical_char);
      this.belongsToMany(
        models.payment_method,
        {
          through: models.available_payment_method,
          foreignKey: 'productId',
          as: 'payment_methods',
        },
      );
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
