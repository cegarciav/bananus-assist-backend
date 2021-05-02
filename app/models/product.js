'use strict';
const {
  Model
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

    }
  };
  product.init({
    price: DataTypes.INTEGER,
    sku: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });

product.associate = function(models) {
  product.hasMany(models.request, {
      as: 'technicalChar',
      foreignKey: 'technicalCharId',
    });
  };

  return product;
};


