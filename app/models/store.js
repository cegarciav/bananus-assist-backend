const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);
      this.hasMany(models.product);
      this.hasMany(models.sale_point);
      // define association here
    }
  }
  store.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'store',
  });
  return store;
};
