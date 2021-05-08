'use strict';
const {
  Model
} = require('sequelize');

const sale_point = require('./sale_point');
module.exports = (sequelize, DataTypes) => {
  class store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.store.belongsTo(models.user)
      models.store.hasMany(models.product)
      models.store.hasMany(models.sale_point)
    }
  };
  store.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'store',
  });
  return store;
};