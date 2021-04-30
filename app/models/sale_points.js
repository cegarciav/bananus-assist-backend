'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sale_points extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sale_points.init({
    id_store: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'sale_points',
  });
  return sale_points;
};