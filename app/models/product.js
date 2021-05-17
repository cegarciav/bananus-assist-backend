const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
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
