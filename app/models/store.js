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
      this.belongsToMany(models.user, { through: models.assistant, as: 'assistants' });
      this.hasMany(models.user, { as: 'supervisors' });
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
