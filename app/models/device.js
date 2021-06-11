'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.central_tablet, {foreignKey: 'central_tabletId'});
      // define association here
    }
  };
  device.init({
    serialNumber: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'device',
  });
  return device;
};