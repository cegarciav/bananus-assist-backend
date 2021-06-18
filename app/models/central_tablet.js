'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class central_tablet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.sale_point, {foreignKey: 'sale_pointId'});
      this.hasMany(models.device, {foreignKey: 'central_tabletId'});
      // define association here
    }
  };
  central_tablet.init({
    serialNumber: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'central_tablet',
  });
  return central_tablet;
};